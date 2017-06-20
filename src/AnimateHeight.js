var React = require('react');
var PropTypes = require('prop-types');
var cx = require('classnames');

const ANIMATION_STATE_CLASSES = {
  animating:                  'rah-animating',
  animatingUp:                'rah-animating--up',
  animatingDown:              'rah-animating--down',
  animatingToHeightZero:      'rah-animating--to-height-zero',
  animatingToHeightAuto:      'rah-animating--to-height-auto',
  animatingToHeightSpecific:  'rah-animating--to-height-specific',
  static:                     'rah-static',
  staticHeightZero:           'rah-static--height-zero',
  staticHeightAuto:           'rah-static--height-auto',
  staticHeightSpecific:       'rah-static--height-specific',
};

function omit(obj, ...keys) {
  if(!keys.length) {
    return obj;
  }

  let res = {};
  for (let key in obj) {
    if(keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
  }

  return res;
}

const AnimateHeight = class extends React.Component {
  constructor(props) {
    super(props);

    let height = 'auto';
    let overflow = 'visible';

    if (this.isNumber(props.height)) {
      height = props.height < 0 ? 0 : props.height;
      overflow = 'hidden';
    }

    this.animationStateClasses = Object.assign(ANIMATION_STATE_CLASSES, props.animationStateClasses);

    const animationStateClasses = this.getStaticStateClasses(height);

    this.state = {
      animationStateClasses,
      height,
      overflow,
      shouldUseTransitions: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      height,
    } = this.props;

    // Check if 'height' prop has changed
    if (this.contentElement && nextProps.height !== height) {
      // Cache content height
      this.contentElement.style.overflow = 'hidden';
      const contentHeight = this.contentElement.offsetHeight;
      this.contentElement.style.overflow = '';

      let newHeight = null;
      const timeoutState = {
        height: null, // it will be always set to either 'auto' or specific number
        overflow: 'hidden',
      };
      const isCurrentHeightAuto = this.state.height === 'auto';
      const FROM_AUTO_TIMEOUT_DURATION = 50;

      clearTimeout(this.timeoutID);

      if (this.isNumber(nextProps.height)) {
        // If new height is a number
        newHeight = nextProps.height < 0 ? 0 : nextProps.height;
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

        this.timeoutID = setTimeout(() => {
          this.setState(timeoutState);

          // ANIMATION STARTS, run a callback if it exists
          this.runCallback(nextProps.onAnimationStart);

        }, FROM_AUTO_TIMEOUT_DURATION);

        // Set static classes and remove transitions when animation ends
        this.animationClassesTimeoutID = setTimeout(() => {
          this.setState({
            animationStateClasses: timeoutAnimationStateClasses,
            shouldUseTransitions: false,
          });

          // ANIMATION ENDS, run a callback if it exists
          this.runCallback(nextProps.onAnimationEnd);
        }, nextProps.duration);
      } else {
        // ANIMATION STARTS, run a callback if it exists
        this.runCallback(nextProps.onAnimationStart);

        // Set end height, classes and remove transitions when animation is complete
        this.timeoutID = setTimeout(() => {
          timeoutState.animationStateClasses = timeoutAnimationStateClasses;
          timeoutState.shouldUseTransitions = false;

          this.setState(timeoutState);

          // ANIMATION ENDS, run a callback if it exists
          this.runCallback(nextProps.onAnimationEnd);
        }, nextProps.duration);
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
    if (callback && typeof(callback) === 'function') {
      callback();
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
      children,
      className,
      contentClassName,
      duration,
      easing,
      style,
    } = this.props;
    const {
      height,
      overflow,
      animationStateClasses,
      shouldUseTransitions,
    } = this.state;


    // Include transition passed through styles
    const userTransition = style.transition ? `${ style.transition },` : '';

    const componentStyle = {
      ...style,
      height,
      overflow: overflow ? overflow : style.overflow,
    };

    if (shouldUseTransitions) {
      componentStyle.WebkitTransition = `${ userTransition } height ${ duration }ms ${ easing } `;
      componentStyle.MozTransition = `${ userTransition } height ${ duration }ms ${ easing } `;
      componentStyle.OTransition = `${ userTransition } height ${ duration }ms ${ easing } `;
      componentStyle.msTransition = `${ userTransition } height ${ duration }ms ${ easing } `;
      componentStyle.transition = `${ userTransition } height ${ duration }ms ${ easing } `;
    }


    const componentClasses = cx({
      [animationStateClasses]: true,
      [className]: className,
    });

    return (
      <div
        {...omit(this.props, 'height', 'duration', 'easing', 'contentClassName', 'animationStateClasses')}
        className={ componentClasses }
        style={ componentStyle }
        >
        <div
          className={ contentClassName }
          ref={ el => this.contentElement = el }>
          { children }
        </div>
      </div>
    );
  }
};

AnimateHeight.propTypes = {
  animationStateClasses: PropTypes.object,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  duration: PropTypes.number.isRequired,
  easing: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onAnimationEnd: PropTypes.func,
  onAnimationStart: PropTypes.func,
  style: PropTypes.object,
};

AnimateHeight.defaultProps = {
  duration: 250,
  easing: 'ease',
  style: {},
  animationStateClasses: ANIMATION_STATE_CLASSES,
};

export default AnimateHeight;
