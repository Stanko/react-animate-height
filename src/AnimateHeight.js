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

    const animationStateClasses = cx({
      [this.animationStateClasses.static]: true,
      [this.animationStateClasses.staticHeightZero]: height === 0,
      [this.animationStateClasses.staticHeightSpecific]: height > 0,
      [this.animationStateClasses.staticHeightAuto]: height === 'auto',
    });

    this.state = {
      animationStateClasses,
      height,
      overflow,
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
      this.contentElement.style.overflow = null;

      let newHeight = null;
      let timeoutHeight = null;
      let timeoutOverflow = 'hidden';
      let timeoutDuration = nextProps.duration;
      const FROM_AUTO_TIMEOUT_DURATION = 50;

      clearTimeout(this.timeoutID);

      if (this.isNumber(nextProps.height)) {
        // If new height is a number
        newHeight = nextProps.height < 0 ? 0 : nextProps.height;
        timeoutHeight = newHeight;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight;
        timeoutHeight = 'auto';
        timeoutOverflow = null;
      }

      if (this.state.height === 'auto') {
        // If previous height was 'auto'
        // set it explicitly to be able to use transition
        timeoutHeight = newHeight;

        newHeight = contentHeight;
        timeoutDuration = FROM_AUTO_TIMEOUT_DURATION;
      }

      const animationStateClasses = cx({
        [this.animationStateClasses.animating]: true,
        [this.animationStateClasses.animatingUp]: height === 'auto' || nextProps.height < height,
        [this.animationStateClasses.animatingDown]: nextProps.height === 'auto' || nextProps.height > height,
        [this.animationStateClasses.animatingToHeightZero]: timeoutHeight === 0,
        [this.animationStateClasses.animatingToHeightAuto]: timeoutHeight === 'auto',
        [this.animationStateClasses.animatingToHeightSpecific]: timeoutHeight > 0,
      });

      // Set starting height and animating classes
      this.setState({
        animationStateClasses,
        height: newHeight,
        overflow: 'hidden',
      });

      clearTimeout(this.timeoutID);
      clearTimeout(this.animationClassesTimeoutID);

      // Set new height
      // Using shorter duration if animation is from "auto"
      this.timeoutID = setTimeout(() => {
        this.setState({
          height: timeoutHeight,
          overflow: timeoutOverflow,
        });
      }, timeoutDuration);

      // Set static classes
      this.animationClassesTimeoutID = setTimeout(() => {
        const animationStateClasses = cx({
          [this.animationStateClasses.static]: true,
          [this.animationStateClasses.staticHeightZero]: timeoutHeight === 0,
          [this.animationStateClasses.staticHeightSpecific]: timeoutHeight > 0,
          [this.animationStateClasses.staticHeightAuto]: timeoutHeight === 'auto',
        });

        this.setState({
          animationStateClasses,
        });
      }, nextProps.duration);
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
    } = this.state;


    // Include transition passed through styles
    const userTransition = style.transition ? `${ style.transition },` : '';

    const componentStyle = {
      ...style,
      height,
      overflow: overflow ? overflow : style.overflow,
      WebkitTransition: `${ userTransition } height ${ duration }ms ${ easing } `,
      MozTransition: `${ userTransition } height ${ duration }ms ${ easing } `,
      OTransition: `${ userTransition } height ${ duration }ms ${ easing } `,
      msTransition: `${ userTransition } height ${ duration }ms ${ easing } `,
      transition: `${ userTransition } height ${ duration }ms ${ easing } `,
    };

    const componentClasses = cx({
      [animationStateClasses]: true,
      [className]: className,
    });

    return (
      <div
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
  style: PropTypes.object,
};

AnimateHeight.defaultProps = {
  duration: 250,
  easing: 'ease',
  style: {},
  animationStateClasses: ANIMATION_STATE_CLASSES,
};

export default AnimateHeight;
