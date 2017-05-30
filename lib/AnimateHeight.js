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

var AnimateHeight = (function (_React$Component) {
  _inherits(AnimateHeight, _React$Component);

  function AnimateHeight(props) {
    var _cx;

    _classCallCheck(this, AnimateHeight);

    _get(Object.getPrototypeOf(AnimateHeight.prototype), 'constructor', this).call(this, props);

    var height = 'auto';
    var overflow = 'visible';

    if (this.isNumber(props.height)) {
      height = props.height < 0 ? 0 : props.height;
      overflow = 'hidden';
    }

    this.animationStateClasses = _extends(ANIMATION_STATE_CLASSES, props.animationStateClasses);

    var animationStateClasses = cx((_cx = {}, _defineProperty(_cx, this.animationStateClasses['static'], true), _defineProperty(_cx, this.animationStateClasses.staticHeightZero, height === 0), _defineProperty(_cx, this.animationStateClasses.staticHeightSpecific, height > 0), _defineProperty(_cx, this.animationStateClasses.staticHeightAuto, height === 'auto'), _cx));

    this.state = {
      animationStateClasses: animationStateClasses,
      height: height,
      overflow: overflow
    };
  }

  _createClass(AnimateHeight, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this = this;

      var height = this.props.height;

      // Check if 'height' prop has changed
      if (this.contentElement && nextProps.height !== height) {
        var _cx2;

        (function () {
          // Cache content height
          _this.contentElement.style.overflow = 'hidden';
          var contentHeight = _this.contentElement.offsetHeight;
          _this.contentElement.style.overflow = null;

          var newHeight = null;
          var timeoutHeight = null;
          var timeoutOverflow = 'hidden';
          var timeoutDuration = nextProps.duration;
          var FROM_AUTO_TIMEOUT_DURATION = 50;

          clearTimeout(_this.timeoutID);

          if (_this.isNumber(nextProps.height)) {
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

          if (_this.state.height === 'auto') {
            // If previous height was 'auto'
            // set it explicitly to be able to use transition
            timeoutHeight = newHeight;

            newHeight = contentHeight;
            timeoutDuration = FROM_AUTO_TIMEOUT_DURATION;
          }

          var animationStateClasses = cx((_cx2 = {}, _defineProperty(_cx2, _this.animationStateClasses.animating, true), _defineProperty(_cx2, _this.animationStateClasses.animatingUp, height === 'auto' || nextProps.height < height), _defineProperty(_cx2, _this.animationStateClasses.animatingDown, nextProps.height === 'auto' || nextProps.height > height), _defineProperty(_cx2, _this.animationStateClasses.animatingToHeightZero, timeoutHeight === 0), _defineProperty(_cx2, _this.animationStateClasses.animatingToHeightAuto, timeoutHeight === 'auto'), _defineProperty(_cx2, _this.animationStateClasses.animatingToHeightSpecific, timeoutHeight > 0), _cx2));

          // Set starting height and animating classes
          _this.setState({
            animationStateClasses: animationStateClasses,
            height: newHeight,
            overflow: 'hidden'
          });

          clearTimeout(_this.timeoutID);
          clearTimeout(_this.animationClassesTimeoutID);

          // Set new height
          // Using shorter duration if animation is from "auto"
          _this.timeoutID = setTimeout(function () {
            _this.setState({
              height: timeoutHeight,
              overflow: timeoutOverflow
            });
          }, timeoutDuration);

          // Set static classes
          _this.animationClassesTimeoutID = setTimeout(function () {
            var _cx3;

            var animationStateClasses = cx((_cx3 = {}, _defineProperty(_cx3, _this.animationStateClasses['static'], true), _defineProperty(_cx3, _this.animationStateClasses.staticHeightZero, timeoutHeight === 0), _defineProperty(_cx3, _this.animationStateClasses.staticHeightSpecific, timeoutHeight > 0), _defineProperty(_cx3, _this.animationStateClasses.staticHeightAuto, timeoutHeight === 'auto'), _cx3));

            _this.setState({
              animationStateClasses: animationStateClasses
            });
          }, nextProps.duration);
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
    key: 'render',
    value: function render() {
      var _cx4,
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

      // Include transition passed through styles
      var userTransition = style.transition ? style.transition + ',' : '';

      var componentStyle = _extends({}, style, {
        height: height,
        overflow: overflow ? overflow : style.overflow,
        WebkitTransition: userTransition + ' height ' + duration + 'ms ' + easing + ' ',
        MozTransition: userTransition + ' height ' + duration + 'ms ' + easing + ' ',
        OTransition: userTransition + ' height ' + duration + 'ms ' + easing + ' ',
        msTransition: userTransition + ' height ' + duration + 'ms ' + easing + ' ',
        transition: userTransition + ' height ' + duration + 'ms ' + easing + ' '
      });

      var componentClasses = cx((_cx4 = {}, _defineProperty(_cx4, animationStateClasses, true), _defineProperty(_cx4, className, className), _cx4));

      return React.createElement(
        'div',
        {
          className: componentClasses,
          style: componentStyle
        },
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