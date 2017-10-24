# React Animate Height

[![npm version](https://img.shields.io/npm/v/react-animate-height.svg?style=flat-square)](https://www.npmjs.com/package/react-animate-height)
[![npm downloads](https://img.shields.io/npm/dm/react-animate-height.svg?style=flat-square)](https://www.npmjs.com/package/react-animate-height)

Lightweight, no dependency React component for animating height using CSS transitions.
Slide up/down the element, and to any specific height.

CSS classes are applied in specific animation states, check `animationStateClasses` prop.

## Demo

Live demo: [stanko.github.io/react-animate-height](https://stanko.github.io/react-animate-height/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8080`](http://localhost:8080) in your browser of choice browser.


## Quick start

Get it from npm

```
$ npm install --save react-animate-height
```

Import and use it in your React app.

```javascript
import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';

class Example extends Component {
  render() {
    return (
      <AnimateHeight
        duration={ 500 }
        height={ 'auto' } // see props documentation bellow
      >
        <h1>Your content goes here</h1>
        <p>Put as many React or HTML components here.</p>
      </AnimateHeight>
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

* **easing**: string, default: `'ease'`

  CSS easing function to be applied to the animation

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

  Callback which will be called when animation starts

* **onAnimationEnd**: function

  Callback which will be called when animation ends
  
* **applyInlineTransitions**: boolean, default: `true`

  If this flag is set to `false` only CSS classes will be applied to the element and inline 
  transition styles will not be present.

Additional props will be passed to the wrapper div, to make adding attrs like `aria-*` easier.


## License

[MIT](https://github.com/Stanko/react-animate-height/blob/master/LICENSE)
