# Animate Height

Lightweight, no dependency React component for animating height using CSS transitions.
Slide up/down the element, and to any specific height.

CSS classes are applied in specific animation states, check `animationStateClasses` prop.

## Demo & Examples

Live demo: [stanko.github.io/react-animate-height](https://stanko.github.io/react-animate-height/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-animate-height is to install it from NPM and include it in your own React build process (using [Webpack](http://webpack.github.io/)).

You can also use the standalone build by including `dist/react-animate-height.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install --save react-animate-height
```


## Usage

```
import AnimateHeight from 'react-animate-height';

<AnimateHeight
  duration={ 500 }
  height={ 'auto' }>
  <h1>Your content goes here</h1>
  <p>Put as many React or HTML components here.</p>
</AnimateHeight>
```

### Properties

* **height**: numeric or 'auto', required

  When changed, element height will be animated to that height.<br/>
  To slide up use <code>0</code>, for slide down use <code>'auto'</code>

* **duration**: integer, default: 250

  Duration of the animation in milliseconds

* **easing**: string, default: 'ease'

  CSS easing function to be applied to the animation

* **className**: string

  CSS class to be applied to the element

* **style**: object

  CSS style object, it will be merged with inline styles of the component

* **contentClassName**: string

  CSS class to be applied to content wrapper element

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

Additional props will be passed to the wrapper div, to make adding attrs like `aria-*` easier.


## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## License

[MIT](https://github.com/Stanko/react-animate-height/blob/master/LICENSE)
