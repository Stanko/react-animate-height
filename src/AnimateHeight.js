var React = require('react');

const AnimateHeight = class extends React.Component {
  constructor(props) {
    super();

    let height = 'auto';
    let overflow = 'visible';

    if (this.isNumber(props.height)) {
      height = props.height < 0 ? 0 : props.height;
      overflow = 'hidden';
    }

    this.state = {
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
      let shouldSetTimeout = false;
      let timeoutHeight = null;
      let timeoutOverflow = 'hidden';
      let timeoutDuration = nextProps.duration;

      clearTimeout(this.timeoutID);

      if (this.isNumber(nextProps.height)) {
        // If new height is a number
        newHeight = nextProps.height < 0 ? 0 : nextProps.height;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight;
        shouldSetTimeout = true;
        timeoutHeight = 'auto';
        timeoutOverflow = 'visible';
      }

      if (this.state.height === 'auto') {
        // If previous height was 'auto'
        // set it explicitly to be able to use transition
        shouldSetTimeout = true;
        timeoutHeight = newHeight;

        newHeight = contentHeight;
        timeoutDuration = 0;
      }

      this.setState({
        height: newHeight,
        overflow: 'hidden',
      });

      if (shouldSetTimeout) {
        this.timeoutID = setTimeout(() => {
          this.setState({
            height: timeoutHeight,
            overflow: timeoutOverflow,
          });
        }, timeoutDuration);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  render() {
    const {
      children,
      className,
      duration,
      easing,
      style,
    } = this.props;
    const {
      height,
      overflow,
    } = this.state;

    const componentStyle = {
      ...style,
      height,
      overflow,
      WebkitTransition: `height ${ duration }ms ${ easing } `,
      MozTransition: `height ${ duration }ms ${ easing } `,
      OTransition: `height ${ duration }ms ${ easing } `,
      msTransition: `height ${ duration }ms ${ easing } `,
      transition: `height ${ duration }ms ${ easing } `,
    };

    return (
      <div
        className={ className }
        style={ componentStyle }
        >
        <div ref={ el => this.contentElement = el }>
          { children }
        </div>
      </div>
    );
  }
};

AnimateHeight.propTypes = {
  children: React.PropTypes.any.isRequired,
  className: React.PropTypes.string,
  duration: React.PropTypes.number.isRequired,
  easing: React.PropTypes.string.isRequired,
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  style: React.PropTypes.object,
};

AnimateHeight.defaultProps = {
  duration: 250,
  easing: 'ease',
  style: {},
};

export default AnimateHeight;
