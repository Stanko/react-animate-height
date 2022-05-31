import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

// ------------------ Types

export type Height = 'auto' | number | `${number}%`;
type Timeout = ReturnType<typeof setTimeout>;
type Overflow = 'auto' | 'visible' | 'hidden' | undefined;
type AnimationStateClasses = {
  animating: string;
  animatingUp: string;
  animatingDown: string;
  animatingToHeightZero: string;
  animatingToHeightAuto: string;
  animatingToHeightSpecific: string;
  static: string;
  staticHeightZero: string;
  staticHeightAuto: string;
  staticHeightSpecific: string;
};

// ------------------ Helpers

function isNumber(n: string) {
  const number = parseFloat(n);
  return !isNaN(number) && isFinite(number);
}

function isPercentage(height: Height) {
  // Percentage height
  return (
    typeof height === 'string' &&
    height[height.length - 1] === '%' &&
    isNumber(height.substring(0, height.length - 1))
  );
}

function hideContent(element: HTMLDivElement | null, height: Height) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (height === 0 && element?.style) {
    element.style.display = 'none';
  }
}

function showContent(element: HTMLDivElement | null, height: Height) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (height === 0 && element?.style) {
    element.style.display = '';
  }
}

const ANIMATION_STATE_CLASSES: AnimationStateClasses = {
  animating: 'rah-animating',
  animatingUp: 'rah-animating--up',
  animatingDown: 'rah-animating--down',
  animatingToHeightZero: 'rah-animating--to-height-zero',
  animatingToHeightAuto: 'rah-animating--to-height-auto',
  animatingToHeightSpecific: 'rah-animating--to-height-specific',
  static: 'rah-static',
  staticHeightZero: 'rah-static--height-zero',
  staticHeightAuto: 'rah-static--height-auto',
  staticHeightSpecific: 'rah-static--height-specific',
};

function getStaticStateClasses(
  animationStateClasses: AnimationStateClasses,
  height: Height
) {
  return classNames({
    [animationStateClasses.static]: true,
    [animationStateClasses.staticHeightZero]: height === 0,
    [animationStateClasses.staticHeightSpecific]: height > 0,
    [animationStateClasses.staticHeightAuto]: height === 'auto',
  });
}

// ------------------ Component

interface AnimateHeightProps extends React.HTMLAttributes<HTMLDivElement> {
  animateOpacity?: boolean;
  animationStateClasses?: AnimationStateClasses;
  applyInlineTransitions?: boolean;
  contentClassName?: string;
  delay?: number;
  duration?: number;
  easing?: string;
  height: Height;
  onHeightAnimationEnd?: (newHeight: Height) => any;
  onHeightAnimationStart?: (newHeight: Height) => any;
  style?: CSSProperties;
}

const AnimateHeight: React.FC<AnimateHeightProps> = ({
  animateOpacity = false,
  animationStateClasses = {},
  applyInlineTransitions = true,
  children,
  className = '',
  contentClassName,
  delay: userDelay = 0,
  duration: userDuration = 500,
  easing = 'ease',
  height,
  onHeightAnimationEnd,
  onHeightAnimationStart,
  style,
  ...props
}) => {
  // ------------------ Initialization
  const prevHeight = useRef<Height>(height);
  const contentElement = useRef<HTMLDivElement>(null);

  const animationClassesTimeoutID = useRef<Timeout>();
  const timeoutID = useRef<Timeout>();

  const stateClasses = useRef<AnimationStateClasses>({
    ...ANIMATION_STATE_CLASSES,
    ...animationStateClasses,
  });

  const isBrowser = typeof window !== 'undefined';

  const prefersReducedMotion = useRef<boolean>(
    isBrowser && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion)').matches
      : false
  );

  const delay = prefersReducedMotion.current ? 0 : userDelay;
  const duration = prefersReducedMotion.current ? 0 : userDuration;

  let initHeight: Height = height;
  let initOverflow: Overflow = 'visible';

  if (typeof initHeight === 'number') {
    // Reset negative height to 0
    initHeight = height < 0 ? 0 : height;
    initOverflow = 'hidden';
  } else if (isPercentage(initHeight)) {
    // If value is string "0%" make sure we convert it to number 0
    initHeight = height === '0%' ? 0 : height;
    initOverflow = 'hidden';
  }

  const [currentHeight, setCurrentHeight] = useState<Height>(initHeight);
  const [overflow, setOverflow] = useState<Overflow>(initOverflow);
  const [useTransitions, setUseTransitions] = useState<boolean>(false);
  const [animationStateClassNames, setAnimationStateClassNames] =
    useState<string>(getStaticStateClasses(stateClasses.current, height));

  // ------------------ Did mount
  useEffect(() => {
    // Hide content if height is 0 (to prevent tabbing into it)
    hideContent(contentElement.current, currentHeight);

    // This should be explicitly run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ Height update
  useEffect(() => {
    if (height !== prevHeight.current && contentElement.current) {
      showContent(contentElement.current, prevHeight.current);

      // Cache content height
      contentElement.current.style.overflow = 'hidden';
      const contentHeight = contentElement.current.offsetHeight;
      contentElement.current.style.overflow = '';

      // set total animation time
      const totalDuration = duration + delay;

      let newHeight: Height;
      let timeoutHeight: Height;
      let timeoutOverflow: Overflow = 'hidden';
      let timeoutUseTransitions: boolean;

      const isCurrentHeightAuto = prevHeight.current === 'auto';

      if (typeof height === 'number') {
        // Reset negative height to 0
        newHeight = height < 0 ? 0 : height;
        timeoutHeight = newHeight;
      } else if (isPercentage(height)) {
        // If value is string "0%" make sure we convert it to number 0
        newHeight = height === '0%' ? 0 : height;
        timeoutHeight = newHeight;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight; // TODO solve contentHeight = 0
        timeoutHeight = 'auto';
        timeoutOverflow = undefined;
      }

      if (isCurrentHeightAuto) {
        // This is the height to be animated to
        timeoutHeight = newHeight;

        // If previous height was 'auto'
        // set starting height explicitly to be able to use transition
        newHeight = contentHeight;
      }

      // Animation classes
      const newAnimationStateClassNames = classNames({
        [stateClasses.current.animating]: true,
        [stateClasses.current.animatingUp]:
          prevHeight.current === 'auto' || height < prevHeight.current,
        [stateClasses.current.animatingDown]:
          height === 'auto' || height > prevHeight.current,
        [stateClasses.current.animatingToHeightZero]: timeoutHeight === 0,
        [stateClasses.current.animatingToHeightAuto]: timeoutHeight === 'auto',
        [stateClasses.current.animatingToHeightSpecific]: timeoutHeight > 0,
      });

      // Animation classes to be put after animation is complete
      const timeoutAnimationStateClasses = getStaticStateClasses(
        stateClasses.current,
        timeoutHeight
      );

      // Set starting height and animating classes
      // When animating from 'auto' we first need to set fixed height
      // that change should be animated
      setCurrentHeight(newHeight);
      setOverflow('hidden');
      setUseTransitions(!isCurrentHeightAuto);
      setAnimationStateClassNames(newAnimationStateClassNames);

      // Clear timeouts
      clearTimeout(timeoutID.current as Timeout);
      clearTimeout(animationClassesTimeoutID.current as Timeout);

      if (isCurrentHeightAuto) {
        // When animating from 'auto' we use a short timeout to start animation
        // after setting fixed height above
        timeoutUseTransitions = true;

        // Short timeout to allow rendering of the initial animation state first
        timeoutID.current = setTimeout(() => {
          setCurrentHeight(timeoutHeight);
          setOverflow(timeoutOverflow);
          setUseTransitions(timeoutUseTransitions);

          // ANIMATION STARTS, run a callback if it exists
          onHeightAnimationStart?.(timeoutHeight);
        }, 50);

        // Set static classes and remove transitions when animation ends
        animationClassesTimeoutID.current = setTimeout(() => {
          setUseTransitions(false);
          setAnimationStateClassNames(timeoutAnimationStateClasses);

          // ANIMATION ENDS
          // Hide content if height is 0 (to prevent tabbing into it)
          hideContent(contentElement.current, timeoutHeight);
          // Run a callback if it exists
          onHeightAnimationEnd?.(timeoutHeight);
        }, totalDuration);
      } else {
        // ANIMATION STARTS, run a callback if it exists
        onHeightAnimationStart?.(newHeight);

        // Set end height, classes and remove transitions when animation is complete
        timeoutID.current = setTimeout(() => {
          setCurrentHeight(timeoutHeight);
          setOverflow(timeoutOverflow);
          setUseTransitions(false);
          setAnimationStateClassNames(timeoutAnimationStateClasses);

          // ANIMATION ENDS
          // If height is auto, don't hide the content
          // (case when element is empty, therefore height is 0)
          if (height !== 'auto') {
            // Hide content if height is 0 (to prevent tabbing into it)
            hideContent(contentElement.current, newHeight); // TODO solve newHeight = 0
          }
          // Run a callback if it exists
          onHeightAnimationEnd?.(newHeight);
        }, totalDuration);
      }
    }

    prevHeight.current = height;

    return () => {
      clearTimeout(timeoutID.current as Timeout);
      clearTimeout(animationClassesTimeoutID.current as Timeout);
    };

    // This should be explicitly run only on height change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // ------------------ Render

  const componentStyle: CSSProperties = {
    ...style,
    height: currentHeight,
    overflow: overflow || style?.overflow,
  };

  if (useTransitions && applyInlineTransitions) {
    componentStyle.transition = `height ${duration}ms ${easing} ${delay}ms`;

    // Include transition passed through styles
    if (style?.transition) {
      componentStyle.transition = `${style.transition}, ${componentStyle.transition}`;
    }

    // Add webkit vendor prefix still used by opera, blackberry...
    componentStyle.WebkitTransition = componentStyle.transition;
  }

  const contentStyle: CSSProperties = {};

  if (animateOpacity) {
    contentStyle.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
    // Add webkit vendor prefix still used by opera, blackberry...
    contentStyle.WebkitTransition = contentStyle.transition;

    if (currentHeight === 0) {
      contentStyle.opacity = 0;
    }
  }

  // Check if user passed aria-hidden prop
  const hasAriaHiddenProp = typeof props['aria-hidden'] !== 'undefined';
  const ariaHidden = hasAriaHiddenProp ? props['aria-hidden'] : height === 0;

  return (
    <div
      {...props}
      aria-hidden={ariaHidden}
      className={`${animationStateClassNames} ${className}`}
      style={componentStyle}
    >
      <div
        className={contentClassName}
        style={contentStyle}
        ref={contentElement}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimateHeight;
