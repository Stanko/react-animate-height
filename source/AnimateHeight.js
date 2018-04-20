import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const ANIMATION_STATE_CLASSES = {
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

function omit(obj, ...keys) {
  if (!keys.length) {
    return obj;
  }

  const res = {};
  const objectKeys = Object.keys(obj);

  for (let i = 0; i < objectKeys.length; i++) {
    const key = objectKeys[i];

    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
  }

  return res;
}

// Start animation helper using nested requestAnimationFrames
function startAnimationHelper(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
}

const AnimateHeight = class extends React.Component {
  constructor(props) {
    super(props);

    let height = 'auto';
    let overflow = 'visible';

    if (this.isNumber(props.height)) {
      height = props.height < 0 ? 0 : props.height;
      overflow = 'hidden';
    } else if (
      // Percentage height
      typeof props.height === 'string' &&
      props.height.search('%') === props.height.length - 1 &&
      this.isNumber(props.height.substr(0, props.height.length - 1))
    ) {
      height = props.height;
      overflow = 'hidden';
    }

    this.animationStateClasses = { ...ANIMATION_STATE_CLASSES, ...props.animationStateClasses };

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

  componentWillReceiveProps(nextProps) {
    const {
      height,
    } = this.props;

    // Check if 'height' prop has changed
    if (this.contentElement && nextProps.height !== height) {
      // Remove display: none from the content div
      // if it was hidden to prevent tabbing into it
      this.showContent();

      // Cache content height
      this.contentElement.style.overflow = 'hidden';
      const contentHeight = this.contentElement.offsetHeight;
      this.contentElement.style.overflow = '';

      // set total animation time
      const totalDuration = nextProps.duration + nextProps.delay;

      let newHeight = null;
      const timeoutState = {
        height: null, // it will be always set to either 'auto' or specific number
        overflow: 'hidden',
      };
      const isCurrentHeightAuto = this.state.height === 'auto';


      if (this.isNumber(nextProps.height)) {
        // If new height is a number
        newHeight = nextProps.height < 0 ? 0 : nextProps.height;
        timeoutState.height = newHeight;
      } else if (
        // Percentage height
        typeof nextProps.height === 'string' &&
        nextProps.height.search('%') === nextProps.height.length - 1 &&
        this.isNumber(nextProps.height.substr(0, nextProps.height.length - 1))
      ) {
        newHeight = nextProps.height;
        timeoutState.height = newHeight;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight;
        timeoutState.height = 'auto';
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
        [this.animationStateClasses.animatingUp]: height === 'auto' || nextProps.height < height,
        [this.animationStateClasses.animatingDown]: nextProps.height === 'auto' || nextProps.height > height,
        [this.animationStateClasses.animatingToHeightZero]: timeoutState.height === 0,
        [this.animationStateClasses.animatingToHeightAuto]: timeoutState.height === 'auto',
        [this.animationStateClasses.animatingToHeightSpecific]: timeoutState.height > 0,
      });

      // Animation classes to be put after animation is complete
      const timeoutAnimationStateClasses = this.getStaticStateClasses(timeoutState.height);

      // Set starting height and animating classes
      this.setState({
        animationStateClasses,
        height: newHeight,
        overflow: 'hidden',
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

        startAnimationHelper(() => {
          this.setState(timeoutState);

          // ANIMATION STARTS, run a callback if it exists
          this.runCallback(nextProps.onAnimationStart);
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
          this.runCallback(nextProps.onAnimationEnd);
        }, totalDuration);
      } else {
        // ANIMATION STARTS, run a callback if it exists
        this.runCallback(nextProps.onAnimationStart);

        // Set end height, classes and remove transitions when animation is complete
        this.timeoutID = setTimeout(() => {
          timeoutState.animationStateClasses = timeoutAnimationStateClasses;
          timeoutState.shouldUseTransitions = false;

          this.setState(timeoutState);

          // ANIMATION ENDS
          // Hide content if height is 0 (to prevent tabbing into it)
          this.hideContent(newHeight);
          // Run a callback if it exists
          this.runCallback(nextProps.onAnimationEnd);
        }, totalDuration);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    clearTimeout(this.animationClassesTimeoutID);
    this.timeoutID = null;
    this.animationClassesTimeoutID = null;
    this.animationStateClasses = null;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  runCallback(callback) {
    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  showContent() {
    if (this.state.height === 0) {
      this.contentElement.style.display = '';
    }
  }

  hideContent(newHeight) {
    if (newHeight === 0) {
      this.contentElement.style.display = 'none';
    }
  }

  getStaticStateClasses(height) {
    return cx({
      [this.animationStateClasses.static]: true,
      [this.animationStateClasses.staticHeightZero]: height === 0,
      [this.animationStateClasses.staticHeightSpecific]: height > 0,
      [this.animationStateClasses.staticHeightAuto]: height === 'auto',
    });
  }

  render() {
    const {
      animateOpacity,
      applyInlineTransitions,
      children,
      className,
      contentClassName,
      duration,
      easing,
      delay,
      style,
    } = this.props;
    const {
      height,
      overflow,
      animationStateClasses,
      shouldUseTransitions,
    } = this.state;


    const componentStyle = {
      ...style,
      height,
      overflow: overflow || style.overflow,
    };

    if (shouldUseTransitions && applyInlineTransitions) {
      componentStyle.transition = `height ${ duration }ms ${ easing } ${ delay }ms`;

      // Include transition passed through styles
      if (style.transition) {
        componentStyle.transition = `${ style.transition }, ${ componentStyle.transition }`;
      }

      // Add webkit vendor prefix still used by opera, blackberry...
      componentStyle.WebkitTransition = componentStyle.transition;
    }

    const contentStyle = {};

    if (animateOpacity) {
      contentStyle.transition = `opacity ${ duration }ms ${ easing } ${ delay }ms`;
      // Add webkit vendor prefix still used by opera, blackberry...
      contentStyle.WebkitTransition = contentStyle.transition;

      if (height === 0) {
        contentStyle.opacity = 0;
      }
    }

    const componentClasses = cx({
      [animationStateClasses]: true,
      [className]: className,
    });

    const propsToOmit = [
      'animateOpacity',
      'animationStateClasses',
      'applyInlineTransitions',
      'contentClassName',
      'duration',
      'easing',
      'height',
      'delay',
    ];

    return (
      <div
        { ...omit(this.props, ...propsToOmit) }
        aria-hidden={ height === 0 }
        className={ componentClasses }
        style={ componentStyle }
      >
        <div
          className={ contentClassName }
          style={ contentStyle }
          ref={ el => this.contentElement = el }
        >
          { children }
        </div>
      </div>
    );
  }
};

AnimateHeight.propTypes = {
  animateOpacity: PropTypes.bool,
  animationStateClasses: PropTypes.object,
  applyInlineTransitions: PropTypes.bool,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  duration: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  easing: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onAnimationEnd: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  onAnimationStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  style: PropTypes.object,
};

AnimateHeight.defaultProps = {
  animateOpacity: false,
  animationStateClasses: ANIMATION_STATE_CLASSES,
  applyInlineTransitions: true,
  duration: 250,
  delay: 0,
  easing: 'ease',
  style: {},
};

export default AnimateHeight;
