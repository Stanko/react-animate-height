'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var cx = require('classnames');

var ANIMATION_STATE_CLASSES = {
  animating: 'rah-animating',
  animatingUp: 'rah-animating--up',
  animatingDown: 'rah-animating--down',
  animatingToHeightZero: 'rah-animating--to-height-zero',
  animatingToHeightAuto: 'rah-animating--to-height-auto',
  animatingToHeightSpecific: 'rah-animating--to-height-specific',
  'static': 'rah-static',
  staticHeightZero: 'rah-static--height-zero',
  staticHeightAuto: 'rah-static--height-auto',
  staticHeightSpecific: 'rah-static--height-specific'
};

function omit(obj) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  if (!keys.length) {
    return obj;
  }

  var res = {};
  for (var key in obj) {
    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
  }

  return res;
}

var AnimateHeight = (function (_React$Component) {
  _inherits(AnimateHeight, _React$Component);

  function AnimateHeight(props) {
    _classCallCheck(this, AnimateHeight);

    _get(Object.getPrototypeOf(AnimateHeight.prototype), 'constructor', this).call(this, props);

    var height = 'auto';
    var overflow = 'visible';

    if (this.isNumber(props.height)) {
      height = props.height < 0 ? 0 : props.height;
      overflow = 'hidden';
    }

    this.animationStateClasses = _extends(ANIMATION_STATE_CLASSES, props.animationStateClasses);

    var animationStateClasses = this.getStaticStateClasses(height);

    this.state = {
      animationStateClasses: animationStateClasses,
      height: height,
      overflow: overflow,
      shouldUseTransitions: false
    };
  }

  _createClass(AnimateHeight, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this = this;

      var height = this.props.height;

      // Check if 'height' prop has changed
      if (this.contentElement && nextProps.height !== height) {
        var _cx;

        (function () {
          // Cache content height
          _this.contentElement.style.overflow = 'hidden';
          var contentHeight = _this.contentElement.offsetHeight;
          _this.contentElement.style.overflow = '';

          var newHeight = null;
          var timeoutState = {
            height: null, // it will be always set to either 'auto' or specific number
            overflow: 'hidden'
          };
          var isCurrentHeightAuto = _this.state.height === 'auto';
          var FROM_AUTO_TIMEOUT_DURATION = 50;

          clearTimeout(_this.timeoutID);

          if (_this.isNumber(nextProps.height)) {
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
          var animationStateClasses = cx((_cx = {}, _defineProperty(_cx, _this.animationStateClasses.animating, true), _defineProperty(_cx, _this.animationStateClasses.animatingUp, height === 'auto' || nextProps.height < height), _defineProperty(_cx, _this.animationStateClasses.animatingDown, nextProps.height === 'auto' || nextProps.height > height), _defineProperty(_cx, _this.animationStateClasses.animatingToHeightZero, timeoutState.height === 0), _defineProperty(_cx, _this.animationStateClasses.animatingToHeightAuto, timeoutState.height === 'auto'), _defineProperty(_cx, _this.animationStateClasses.animatingToHeightSpecific, timeoutState.height > 0), _cx));

          // Animation classes to be put after animation is complete
          var timeoutAnimationStateClasses = _this.getStaticStateClasses(timeoutState.height);

          // Set starting height and animating classes
          _this.setState({
            animationStateClasses: animationStateClasses,
            height: newHeight,
            overflow: 'hidden',
            // When animating from 'auto' we first need to set fixed height
            // that change should be animated
            shouldUseTransitions: !isCurrentHeightAuto
          });

          // Clear timeouts
          clearTimeout(_this.timeoutID);
          clearTimeout(_this.animationClassesTimeoutID);

          if (isCurrentHeightAuto) {
            // When animating from 'auto' we use a short timeout to start animation
            // after setting fixed height above
            timeoutState.shouldUseTransitions = true;

            _this.timeoutID = setTimeout(function () {
              _this.setState(timeoutState);

              // ANIMATION STARTS, run a callback if it exists
              _this.runCallback(nextProps.onAnimationStart);
            }, FROM_AUTO_TIMEOUT_DURATION);

            // Set static classes and remove transitions when animation ends
            _this.animationClassesTimeoutID = setTimeout(function () {
              _this.setState({
                animationStateClasses: timeoutAnimationStateClasses,
                shouldUseTransitions: false
              });

              // ANIMATION ENDS, run a callback if it exists
              _this.runCallback(nextProps.onAnimationEnd);
            }, nextProps.duration);
          } else {
            // ANIMATION STARTS, run a callback if it exists
            _this.runCallback(nextProps.onAnimationStart);

            // Set end height, classes and remove transitions when animation is complete
            _this.timeoutID = setTimeout(function () {
              timeoutState.animationStateClasses = timeoutAnimationStateClasses;
              timeoutState.shouldUseTransitions = false;

              _this.setState(timeoutState);

              // ANIMATION ENDS, run a callback if it exists
              _this.runCallback(nextProps.onAnimationEnd);
            }, nextProps.duration);
          }
        })();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeoutID);
      clearTimeout(this.animationClassesTimeoutID);
      this.timeoutID = null;
      this.animationClassesTimeoutID = null;
      this.animationStateClasses = null;
    }
  }, {
    key: 'isNumber',
    value: function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }, {
    key: 'runCallback',
    value: function runCallback(callback) {
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  }, {
    key: 'getStaticStateClasses',
    value: function getStaticStateClasses(height) {
      var _cx2;

      return cx((_cx2 = {}, _defineProperty(_cx2, this.animationStateClasses['static'], true), _defineProperty(_cx2, this.animationStateClasses.staticHeightZero, height === 0), _defineProperty(_cx2, this.animationStateClasses.staticHeightSpecific, height > 0), _defineProperty(_cx2, this.animationStateClasses.staticHeightAuto, height === 'auto'), _cx2));
    }
  }, {
    key: 'render',
    value: function render() {
      var _cx3,
          _this2 = this;

      var _props = this.props;
      var children = _props.children;
      var className = _props.className;
      var contentClassName = _props.contentClassName;
      var duration = _props.duration;
      var easing = _props.easing;
      var style = _props.style;
      var _state = this.state;
      var height = _state.height;
      var overflow = _state.overflow;
      var animationStateClasses = _state.animationStateClasses;
      var shouldUseTransitions = _state.shouldUseTransitions;

      // Include transition passed through styles
      var userTransition = style.transition ? style.transition + ',' : '';

      var componentStyle = _extends({}, style, {
        height: height,
        overflow: overflow ? overflow : style.overflow
      });

      if (shouldUseTransitions) {
        componentStyle.WebkitTransition = userTransition + ' height ' + duration + 'ms ' + easing + ' ';
        componentStyle.MozTransition = userTransition + ' height ' + duration + 'ms ' + easing + ' ';
        componentStyle.OTransition = userTransition + ' height ' + duration + 'ms ' + easing + ' ';
        componentStyle.msTransition = userTransition + ' height ' + duration + 'ms ' + easing + ' ';
        componentStyle.transition = userTransition + ' height ' + duration + 'ms ' + easing + ' ';
      }

      var componentClasses = cx((_cx3 = {}, _defineProperty(_cx3, animationStateClasses, true), _defineProperty(_cx3, className, className), _cx3));

      return React.createElement(
        'div',
        _extends({}, omit(this.props, 'height', 'duration', 'easing', 'contentClassName', 'animationStateClasses'), {
          className: componentClasses,
          style: componentStyle
        }),
        React.createElement(
          'div',
          {
            className: contentClassName,
            ref: function (el) {
              return _this2.contentElement = el;
            } },
          children
        )
      );
    }
  }]);

  return AnimateHeight;
})(React.Component);

AnimateHeight.propTypes = {
  animationStateClasses: PropTypes.object,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  duration: PropTypes.number.isRequired,
  easing: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAnimationEnd: PropTypes.func,
  onAnimationStart: PropTypes.func,
  style: PropTypes.object
};

AnimateHeight.defaultProps = {
  duration: 250,
  easing: 'ease',
  style: {},
  animationStateClasses: ANIMATION_STATE_CLASSES
};

exports['default'] = AnimateHeight;
module.exports = exports['default'];