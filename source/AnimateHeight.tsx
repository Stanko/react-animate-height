import React from "react";
import PropTypes, { Validator } from "prop-types";
import cx from "classnames";
import {
  omit,
  startAnimationHelper,
  cancelAnimationFrames,
  isNumber,
  isPercentage,
  runCallback,
  parseHeight,
  prefersReducedMotion,
  isAriaHidden,
  getContentStyle,
  getTimings,
} from "./utils";
import { ANIMATION_STATE_CLASSES, PROPS_TO_OMIT } from "./constants";
import type { AnimateHeightProps } from "./types";

interface AnimateHeightState {
  animationStateClasses?: Record<string, string> | string;
  height?: string | number;
  overflow?: string;
  shouldUseTransitions?: boolean;
}

class AnimateHeight extends React.Component<
  AnimateHeightProps,
  AnimateHeightState
> {
  private animationFrameIDs: number[] = [];

  private timeoutID: number | undefined;

  private animationClassesTimeoutID: number | undefined;

  private prefersReducedMotion = prefersReducedMotion();

  private animationStateClasses: Record<string, string>;

  private contentElement: HTMLDivElement | undefined;

  constructor(props) {
    super(props);
    const [height, overflow] = parseHeight(props.height);
    this.animationStateClasses = {
      ...ANIMATION_STATE_CLASSES,
      ...props.animationStateClasses,
    };

    const animationStateClasses = this.getStaticStateClasses(height);
    this.state = {
      animationStateClasses,
      height,
      overflow,
      shouldUseTransitions: false,
    };
  }

  componentDidMount() {
    const { height } = this.state;

    // Hide content if height is 0 (to prevent tabbing into it)
    // Check for contentElement is added cause this would fail in tests (react-test-renderer)
    // Read more here: https://github.com/Stanko/react-animate-height/issues/17
    if (this.contentElement && this.contentElement.style) {
      this.hideContent(height);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      height,
      onAnimationEnd,
      onAnimationStart,
      delay: delayProp,
      duration: durationProp,
    } = this.props;

    const { duration, delay } = getTimings(
      delayProp,
      durationProp,
      this.prefersReducedMotion
    );

    // Check if 'height' prop has changed
    if (this.contentElement && height !== prevProps.height) {
      // Remove display: none from the content div
      // if it was hidden to prevent tabbing into it
      this.showContent(prevState.height);

      // Cache content height
      this.contentElement.style.overflow = "hidden";
      const contentHeight = this.contentElement.offsetHeight;
      this.contentElement.style.overflow = "";

      // set total animation time
      const totalDuration = duration + delay;

      let newHeight = null;
      const timeoutState: AnimateHeightState = {
        height: null, // it will be always set to either 'auto' or specific number
        overflow: "hidden",
      };
      const isCurrentHeightAuto = prevState.height === "auto";

      if (isNumber(height)) {
        // If value is string "0" make sure we convert it to number 0
        newHeight = height < 0 || height === "0" ? 0 : height;
        timeoutState.height = newHeight;
      } else if (isPercentage(height)) {
        // If value is string "0%" make sure we convert it to number 0
        newHeight = height === "0%" ? 0 : height;
        timeoutState.height = newHeight;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight; // TODO solve contentHeight = 0
        timeoutState.height = "auto";
        timeoutState.overflow = null;
      }

      if (isCurrentHeightAuto) {
        // This is the height to be animated to
        timeoutState.height = newHeight;

        // If previous height was 'auto'
        // set starting height explicitly to be able to use transition
        newHeight = contentHeight;
      }

      // Animation classes
      const animationStateClasses = cx({
        [this.animationStateClasses.animating]: true,
        [this.animationStateClasses.animatingUp]:
          prevProps.height === "auto" || height < prevProps.height,
        [this.animationStateClasses.animatingDown]:
          height === "auto" || height > prevProps.height,
        [this.animationStateClasses.animatingToHeightZero]:
          timeoutState.height === 0,
        [this.animationStateClasses.animatingToHeightAuto]:
          timeoutState.height === "auto",
        [this.animationStateClasses.animatingToHeightSpecific]:
          timeoutState.height > 0,
      });

      // Animation classes to be put after animation is complete
      const timeoutAnimationStateClasses = this.getStaticStateClasses(
        timeoutState.height
      );

      // Set starting height and animating classes
      // We are safe to call set state as it will not trigger infinite loop
      // because of the "height !== prevProps.height" check
      this.setState({
        // eslint-disable-line react/no-did-update-set-state
        animationStateClasses,
        height: newHeight,
        overflow: "hidden",
        // When animating from 'auto' we first need to set fixed height
        // that change should be animated
        shouldUseTransitions: !isCurrentHeightAuto,
      });

      // Clear timeouts
      clearTimeout(this.timeoutID);
      clearTimeout(this.animationClassesTimeoutID);

      if (isCurrentHeightAuto) {
        // When animating from 'auto' we use a short timeout to start animation
        // after setting fixed height above
        timeoutState.shouldUseTransitions = true;

        cancelAnimationFrames(this.animationFrameIDs);
        this.animationFrameIDs = startAnimationHelper(() => {
          this.setState(timeoutState);

          // ANIMATION STARTS, run a callback if it exists
          runCallback(onAnimationStart, { newHeight: timeoutState.height });
        });

        // Set static classes and remove transitions when animation ends
        this.animationClassesTimeoutID = setTimeout(() => {
          this.setState({
            animationStateClasses: timeoutAnimationStateClasses,
            shouldUseTransitions: false,
          });

          // ANIMATION ENDS
          // Hide content if height is 0 (to prevent tabbing into it)
          this.hideContent(timeoutState.height);
          // Run a callback if it exists
          runCallback(onAnimationEnd, { newHeight: timeoutState.height });
        }, totalDuration);
      } else {
        // ANIMATION STARTS, run a callback if it exists
        runCallback(onAnimationStart, { newHeight });

        // Set end height, classes and remove transitions when animation is complete
        this.timeoutID = setTimeout(() => {
          timeoutState.animationStateClasses = timeoutAnimationStateClasses;
          timeoutState.shouldUseTransitions = false;

          this.setState(timeoutState);

          // ANIMATION ENDS
          // If height is auto, don't hide the content
          // (case when element is empty, therefore height is 0)
          if (height !== "auto") {
            // Hide content if height is 0 (to prevent tabbing into it)
            this.hideContent(newHeight); // TODO solve newHeight = 0
          }
          // Run a callback if it exists
          runCallback(onAnimationEnd, { newHeight });
        }, totalDuration);
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrames(this.animationFrameIDs);

    clearTimeout(this.timeoutID);
    clearTimeout(this.animationClassesTimeoutID);

    this.timeoutID = null;
  }

  getStaticStateClasses(height) {
    return cx({
      [this.animationStateClasses.static]: true,
      [this.animationStateClasses.staticHeightZero]: height === 0,
      [this.animationStateClasses.staticHeightSpecific]: height > 0,
      [this.animationStateClasses.staticHeightAuto]: height === "auto",
    });
  }

  showContent(height) {
    if (height === 0) {
      this.contentElement.style.display = "";
    }
  }

  hideContent(newHeight) {
    if (newHeight === 0) {
      this.contentElement.style.display = "none";
    }
  }

  render() {
    const {
      animateOpacity,
      applyInlineTransitions,
      children,
      className,
      contentClassName,
      easing,
      id,
      style,
      delay: delayProp,
      duration: durationProp,
      "aria-hidden": ariaHiddenProp,
    } = this.props;
    const { height, overflow, animationStateClasses, shouldUseTransitions } =
      this.state;

    const { duration, delay } = getTimings(
      delayProp,
      durationProp,
      this.prefersReducedMotion
    );

    const componentStyle = {
      ...style,
      height,
      overflow: overflow || style.overflow,
    };

    if (shouldUseTransitions && applyInlineTransitions) {
      componentStyle.transition = `height ${duration}ms ${easing} ${delay}ms`;

      // Include transition passed through styles
      if (style.transition) {
        componentStyle.transition = `${style.transition}, ${componentStyle.transition}`;
      }

      // Add webkit vendor prefix still used by opera, blackberry...
      componentStyle.WebkitTransition = componentStyle.transition;
    }

    const contentStyle = getContentStyle(
      height,
      animateOpacity,
      duration,
      delay,
      easing
    );

    const componentClasses = cx({
      [animationStateClasses as string]: true,
      [className]: className,
    });

    const ariaHidden = isAriaHidden(ariaHiddenProp, height);
    return (
      <div
        {...omit(this.props, ...PROPS_TO_OMIT)}
        aria-hidden={ariaHidden}
        className={componentClasses}
        id={id}
        style={componentStyle}
      >
        <div
          className={contentClassName}
          style={contentStyle}
          ref={(el) => (this.contentElement = el)}
        >
          {children}
        </div>
      </div>
    );
  }
}

const heightPropType: Validator<string | number> = (
  props,
  propName: string,
  componentName: string
) => {
  const value = props[propName];

  if (
    (typeof value === "number" && value >= 0) ||
    isPercentage(value) ||
    value === "auto"
  ) {
    return null;
  }

  return new TypeError(
    `value "${value}" of type "${typeof value}" is invalid type for ${propName} in ${componentName}. ` +
      'It needs to be a positive number, string "auto" or percentage string (e.g. "15%").'
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
(AnimateHeight as any).propTypes = {
  "aria-hidden": PropTypes.bool,
  animateOpacity: PropTypes.bool,
  animationStateClasses: PropTypes.object,
  applyInlineTransitions: PropTypes.bool,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  delay: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.string,
  height: heightPropType,
  id: PropTypes.string,
  onAnimationEnd: PropTypes.func,
  onAnimationStart: PropTypes.func,
  style: PropTypes.object,
};

(AnimateHeight as any).defaultProps = {
  animateOpacity: false,
  animationStateClasses: ANIMATION_STATE_CLASSES,
  applyInlineTransitions: true,
  duration: 250,
  delay: 0,
  easing: "ease",
  style: {},
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default AnimateHeight;
