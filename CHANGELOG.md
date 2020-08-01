# Changelog

### v2.0.23

01.08.2020.

**Added**

* Added "id" and "aria-hidden" props.
* Added section about accessibility in the readme.

-----

### v2.0.22

15.07.2020.

**Added**

* Added "engines" to `package.json` - [#91](https://github.com/Stanko/react-animate-height/issues/91)

-----

### v2.0.21

18.04.2020.

**Updated**

* Updated the readme with the specific flex box usecase - [#89](https://github.com/Stanko/react-animate-height/issues/89)

-----

### v2.0.18, v2.0.19 and v2.0.20

23.12.2019. and 17.01.2020.

**Fixed**

* Fixed TS types - [#88](https://github.com/Stanko/react-animate-height/issues/88)

-----

### v2.0.17

09.11.2019.

**Fixed**

* Fixed TS types to include `HTMLAttributes<HTMLDivElement>` [#86](https://github.com/Stanko/react-animate-height/issues/86)

-----

### v2.0.16

08.10.2019.

**Fixed**

* Request animation frame is now cleared on unmount

-----

### v2.0.14-v2.0.15

18.06.2019.

**Fixed**

* Reverted back changes, which led to a broken build.

-----

### v2.0.10-v2.0.13

17.06.2019.

**Fixed**

* Package now works as a ESM module [#73](https://github.com/Stanko/react-animate-height/issues/73).

-----

### v2.0.9

16.05.2019.

**Fixed**

* Improved prop types for `height` prop.

-----

### v2.0.8

16.03.2019.

**Fixed**

* Fixed type definitions [#68](https://github.com/Stanko/react-animate-height/issues/68).

-----

### v2.0.7

12.11.2018.

**Added**

* Added param to `onAnimationStart` and `onAnimationEnd` callbacks, it is a object containing `newHeight` value in pixels.

-----

### v2.0.6

03.10.2018.

**Changed**

* Removed `@types/react` from `optionalDependencies` [#62](https://github.com/Stanko/react-animate-height/issues/62).

-----

### v2.0.5

26.09.2018.

**Fixed**

* Fixed [#61](https://github.com/Stanko/react-animate-height/issues/61) - omitted `onAnimationStart` and `onAnimationEnd` from being passed to the DOM element directly.

-----

### v2.0.4

15.08.2018.

**Refactored**

* Added `isPercentage` helper function.

-----

### v2.0.3

12.07.2018.

**Fixed**

* Fixed small bug introduced with 2.0.0 - In `componentDidMount`, `this.state` was used instead of `prevState`
* Content is not being hidden if set height is `auto`

-----

### v2.0.2

11.07.2018.

**Fixed**

* Fixed type script definitions file

-----

### v2.0.0 and v2.0.1

20.05.2018.

**Changed**

* Replaced `componentWillReceiveProps` by `componentDidUpdate` to address changes introduces with React v16.3

-----

### v1.0.4

20.05.2018.

**Changed**

* Enabled react v16.3+ in peer dependencies until react-animate-height v2 is out

-----

### v1.0.3

20.05.2018.

**Changed**

* Moved helpers outside of component to make component lighter
* Updated few dependencies

-----

### v1.0.2

21.04.2018.

**Added**

* Added `delay` prop, kudos to @quagliero [#51](https://github.com/Stanko/react-animate-height/pull/51)
* Changelog

-----

### v1.0.1

30.03.2018.

**Fixed**

* `animateOpacity` prop was passed directly to the `div` element, omitted it

-----

### v1.0.0

30.03.2018.

**Added**

* `animateOpacity` prop which fades content in or out depending on animation direction

**Changed**

* Removed unused vendor prefixes for `translate`

-----

For changes prior version 1.0.0 please check the [commit list](https://github.com/Stanko/react-animate-height/commits/master).
