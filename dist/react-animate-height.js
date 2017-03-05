(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AnimateHeight = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var AnimateHeight = (function (_React$Component) {
  _inherits(AnimateHeight, _React$Component);

  function AnimateHeight(props) {
    _classCallCheck(this, AnimateHeight);

    _get(Object.getPrototypeOf(AnimateHeight.prototype), 'constructor', this).call(this);

    var height = 'auto';
    var overflow = 'visible';

    if (this.isNumber(props.height)) {
      height = props.height < 0 ? 0 : props.height;
      overflow = 'hidden';
    }

    this.state = {
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
        (function () {
          // Cache content height
          _this.contentElement.style.overflow = 'hidden';
          var contentHeight = _this.contentElement.offsetHeight;
          _this.contentElement.style.overflow = null;

          var newHeight = null;
          var shouldSetTimeout = false;
          var timeoutHeight = null;
          var timeoutOverflow = 'hidden';
          var timeoutDuration = nextProps.duration;

          clearTimeout(_this.timeoutID);

          if (_this.isNumber(nextProps.height)) {
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

          if (_this.state.height === 'auto') {
            // If previous height was 'auto'
            // set it explicitly to be able to use transition
            shouldSetTimeout = true;
            timeoutHeight = newHeight;

            newHeight = contentHeight;
            timeoutDuration = 0;
          }

          _this.setState({
            height: newHeight,
            overflow: 'hidden'
          });

          if (shouldSetTimeout) {
            _this.timeoutID = setTimeout(function () {
              _this.setState({
                height: timeoutHeight,
                overflow: timeoutOverflow
              });
            }, timeoutDuration);
          }
        })();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }
  }, {
    key: 'isNumber',
    value: function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var children = _props.children;
      var className = _props.className;
      var duration = _props.duration;
      var easing = _props.easing;
      var style = _props.style;
      var _state = this.state;
      var height = _state.height;
      var overflow = _state.overflow;

      var componentStyle = _extends({}, style, {
        height: height,
        overflow: overflow,
        WebkitTransition: 'height ' + duration + 'ms ' + easing + ' ',
        MozTransition: 'height ' + duration + 'ms ' + easing + ' ',
        OTransition: 'height ' + duration + 'ms ' + easing + ' ',
        msTransition: 'height ' + duration + 'ms ' + easing + ' ',
        transition: 'height ' + duration + 'ms ' + easing + ' '
      });

      return React.createElement(
        'div',
        {
          className: className,
          style: componentStyle
        },
        React.createElement(
          'div',
          { ref: function (el) {
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
  children: React.PropTypes.any.isRequired,
  className: React.PropTypes.string,
  duration: React.PropTypes.number.isRequired,
  easing: React.PropTypes.string.isRequired,
  height: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  style: React.PropTypes.object
};

AnimateHeight.defaultProps = {
  duration: 250,
  easing: 'ease',
  style: {}
};

exports['default'] = AnimateHeight;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});