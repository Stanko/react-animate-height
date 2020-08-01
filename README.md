# React Animate Height

[![npm version](https://img.shields.io/npm/v/react-animate-height.svg?style=flat-square)](https://www.npmjs.com/package/react-animate-height)
[![npm downloads](https://img.shields.io/npm/dm/react-animate-height.svg?style=flat-square)](https://www.npmjs.com/package/react-animate-height)

Lightweight React component for animating height using CSS transitions.
Slide up/down the element, and animate it to any specific height.
Content's opacity can be optionally animated as well (check `animateOpacity` prop bellow).

CSS classes are applied in specific animation states, check `animationStateClasses` prop.

[Changelog](CHANGELOG.md)

### Note about versions

For React >=16.3.0 (17 included) make sure you are using v2.x.

Read more about [React lifecycle changes](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) introduced with React 16.3.

## Demo

Live demo: [muffinman.io/react-animate-height](https://muffinman.io/react-animate-height/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8080`](http://localhost:8080) in your browser of choice browser.

Or play with this [sandbox](https://codesandbox.io/s/react-animate-height-basic-example-ql384).

## Quick start

Get it from npm

```
$ npm install --save react-animate-height
```

Import and use it in your React app.

```jsx
import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';

export default class Example extends Component {
  state = {
    height: 0,
  };

  toggle = () => {
    const { height } = this.state;

    this.setState({
      height: height === 0 ? 'auto' : 0,
    });
  };

  render() {
    const { height } = this.state;

    return (
      <div>
        <button 
          aria-expanded={ height !== 0 }
          aria-controls='example-panel'
          onClick={ this.toggle }
        >
          { height === 0 ? 'Open' : 'Close' }
        </button>

        <AnimateHeight
          id='example-panel'
          duration={ 500 }
          height={ height } // see props documentation below
        >
          <h1>Your content goes here</h1>
          <p>Put as many React or HTML components here.</p>
        </AnimateHeight>
      </div>
    );
  }
}

```

### Props

* **height**: numeric or percentage value (ie. `'50%'`) or `'auto'`, required

  When changed, element height will be animated to that height.<br/>
  To slide up use <code>0</code>, for slide down use <code>'auto'</code>

* **duration**: integer, default: `250`

  Duration of the animation in milliseconds

* **delay**: integer, default: `0`

  Animation delay in milliseconds

* **easing**: string, default: `'ease'`

  CSS easing function to be applied to the animation

* **id**: string

  HTML `id` attribute.

* **className**: string

  CSS class to be applied to the element

  **Please note that you shouldn't apply properties that are messing with the layout (like `display`, `height`...), as these might break height calculations**

* **style**: object

  CSS style object, it will be merged with inline styles of the component

  **Please note that you shouldn't apply properties that are messing with the layout (like `display`, `height`...), as these might break height calculations**

* **contentClassName**: string

  CSS class to be applied to content wrapper element

  **Please note that you shouldn't apply properties that are messing with the layout (like `display`, `height`...), as these might break height calculations**

* **animationStateClasses**: object

  Object containing CSS class names for animation states, default:

  ```
  {
    animating:                  'rah-animating',
    animatingUp:                'rah-animating--up',
    animatingDown:              'rah-animating--down',
    static:                     'rah-static',
    animatingToHeightZero:      'rah-animating--to-height-zero',
    animatingToHeightAuto:      'rah-animating--to-height-auto',
    animatingToHeightSpecific:  'rah-animating--to-height-specific',
    staticHeightZero:           'rah-static--height-zero',
    staticHeightAuto:           'rah-static--height-auto',
    staticHeightSpecific:       'rah-static--height-specific',
  }
  ```

  Please note that this one will be merged with the default object and cached when component is created,
  so changing it afterwards will have no effect.

* **onAnimationStart**: function

  Callback which will be called when animation starts.

  This first argument passed to this callback is an object containing `newHeight`, the pixel value of the height at which the animation will end.

* **onAnimationEnd**: function

  Callback which will be called when animation ends.

  This first argument passed to this callback is an object containing `newHeight`, the pixel value of the height at which the animation ended.

* **applyInlineTransitions**: boolean, default: `true`

  If this flag is set to `false` only CSS classes will be applied to the element and inline
  transition styles will not be present.

* **animateOpacity**: boolean, default: `false`

  If set to `true` content will fade-in (and fade-out) while height is animated.

* **aria-hidden**: boolean

  By default, library will set `aria-hidden` to `true` when height is zero. If you wish to override it, you can pass the prop yourself.

Additional props will be passed to the wrapper div, to make adding attrs like `aria-*` easier.

## Accessibility

Library will hide the content using `display: hidden` when height props is 0. It will also apply `aria-hidden="true"` in the same case, but you can override it by passing `aria-hidden` prop yourself.

When using a button to toggle height, make sure you add `aria-expanded` and `aria-controls` to make everything accessible. Here's an example:

```jsx
<button 
  aria-expanded={ height !== 0 }
  aria-controls='example-panel' // it has to match the id passed to AnimateHeight
  onClick={ toggleHeight } // your click handler that toggles height
  // ... all other props
>
  Toggle
</button>

<AnimateHeight id='example-panel'>
  Content
</AnimateHeight>
```

## Gotchas

### Bounded flexboxes

If `AnimateHeight` is a flex child and it's parent has a fixed height, animation won't work.
To fix this, you just need to add the following CSS rule to the `AnimateHeight` instance.

```css
flex-shrink: 0;
```

You can do it by passing a `className` or directly in the `style` prop 

```jsx
<AnimateHeight style={{flexShrink: 0}}>
```

Check the [issue #89](https://github.com/Stanko/react-animate-height/issues/89) for the example and more details.

## License

[MIT](https://github.com/Stanko/react-animate-height/blob/master/LICENSE)
