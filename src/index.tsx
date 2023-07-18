import React, { CSSProperties, useEffect, useRef, useState } from 'react';

// ------------------ Types

export type DimensionSize = 'auto' | number | `${number}%`;
type Timeout = ReturnType<typeof setTimeout>;
type Overflow = 'auto' | 'visible' | 'hidden' | undefined;
type AnimationStateClasses = {
  animating: string;
  animatingUp: string;
  animatingDown: string;
  animatingToDimZero: string;
  animatingToDimAuto: string;
  animatingToDimSpecific: string;
  static: string;
  staticDimZero: string;
  staticDimAuto: string;
  staticDimSpecific: string;
};

// ------------------ Helpers

function isNumber(n: string) {
  const number = parseFloat(n);
  return !isNaN(number) && isFinite(number);
}

function isPercentage(dimSize: DimensionSize) {
  // Percentage dimension
  return (
    typeof dimSize === 'string' &&
    dimSize[dimSize.length - 1] === '%' &&
    isNumber(dimSize.substring(0, dimSize.length - 1))
  );
}

function hideContent(element: HTMLDivElement | null, dimSize: DimensionSize) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (dimSize === 0 && element?.style) {
    element.style.display = 'none';
  }
}

function showContent(element: HTMLDivElement | null, dimSize: DimensionSize) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (dimSize === 0 && element?.style) {
    element.style.display = '';
  }
}

const ANIMATION_STATE_CLASSES: AnimationStateClasses = {
  animating: 'rah-animating',
  animatingUp: 'rah-animating--up',
  animatingDown: 'rah-animating--down',
  animatingToDimZero: 'rah-animating--to-height-zero',
  animatingToDimAuto: 'rah-animating--to-height-auto',
  animatingToDimSpecific: 'rah-animating--to-height-specific',
  static: 'rah-static',
  staticDimZero: 'rah-static--height-zero',
  staticDimAuto: 'rah-static--height-auto',
  staticDimSpecific: 'rah-static--height-specific',
};

function getStaticStateClasses(
  animationStateClasses: AnimationStateClasses,
  dimSize: DimensionSize
) {
  return [
    animationStateClasses.static,
    dimSize === 0 && animationStateClasses.staticDimZero,
    typeof dimSize === 'number' && dimSize > 0
      ? animationStateClasses.staticDimSpecific
      : null,
    dimSize === 'auto' && animationStateClasses.staticDimAuto,
  ]
    .filter((v) => v)
    .join(' ');
}

// ------------------ Component

const propsToOmitFromDiv: (keyof AnimateDimProps)[] = [
  'animateOpacity',
  'animationStateClasses',
  'applyInlineTransitions',
  'children',
  'className',
  'contentClassName',
  'contentRef',
  'delay',
  'duration',
  'easing',
  'onDimAnimationEnd',
  'onDimAnimationStart',
  'style',
];

// display and height are set by the component itself, therefore ignored
// TODO: omit height or width, as appropriate; really maybe this isn't needed?
type OmitCSSProperties = 'display';

export interface AnimateDimProps extends React.HTMLAttributes<HTMLDivElement> {
  animateOpacity?: boolean;
  animationStateClasses?: AnimationStateClasses;
  applyInlineTransitions?: boolean;
  contentClassName?: string;
  contentRef?: React.MutableRefObject<HTMLDivElement | null>;
  delay?: number;
  duration?: number;
  easing?: string;
  dimSize: DimensionSize;
  dim: 'height' | 'width';
  onDimAnimationEnd?: (newDimSize: DimensionSize) => any;
  onDimAnimationStart?: (newDimSize: DimensionSize) => any;
  style?: Omit<CSSProperties, OmitCSSProperties>;
}

const AnimateDim = React.forwardRef<HTMLDivElement, AnimateDimProps>(
  (componentProps, ref) => {
    // const AnimateHeight = forwardRef((componentProps: AnimateHeightProps, ref) => {
    // const AnimateHeight: React.FC<AnimateHeightProps> = (componentProps) => {
    const {
      animateOpacity = false,
      animationStateClasses = {},
      applyInlineTransitions = true,
      children,
      className = '',
      contentClassName,
      delay: userDelay = 0,
      duration: userDuration = 500,
      easing = 'ease',
      dim,
      dimSize,
      onDimAnimationEnd: onDimAnimationEnd,
      onDimAnimationStart: onDimAnimationStart,
      style,
      contentRef,
    } = componentProps;
    const isHeight = dim === 'height';

    const divProps = { ...componentProps };
    propsToOmitFromDiv.forEach((propKey) => {
      delete divProps[propKey];
    });
    if (isHeight) {
      delete divProps['height'];
    } else {
      delete divProps['width'];
    }

    // ------------------ Initialization
    const prevDimSize = useRef<DimensionSize>(dimSize);
    const contentElement = useRef<HTMLDivElement | null>(null);

    const animationClassesTimeoutID = useRef<Timeout>();
    const timeoutID = useRef<Timeout>();

    const stateClasses = useRef<AnimationStateClasses>({
      ...ANIMATION_STATE_CLASSES,
      ...animationStateClasses,
    });

    const isBrowser = typeof window !== 'undefined';

    const prefersReducedMotion = useRef<boolean>(
      isBrowser && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion)').matches
        : false
    );

    const delay = prefersReducedMotion.current ? 0 : userDelay;
    const duration = prefersReducedMotion.current ? 0 : userDuration;

    let initDimSize: DimensionSize = dimSize;
    let initOverflow: Overflow = 'visible';

    if (typeof dimSize === 'number') {
      // Reset negative dim size to 0
      initDimSize = dimSize < 0 ? 0 : dimSize;
      initOverflow = 'hidden';
    } else if (isPercentage(initDimSize)) {
      // If value is string "0%" make sure we convert it to number 0
      initDimSize = dimSize === '0%' ? 0 : dimSize;
      initOverflow = 'hidden';
    }

    const [currentDimSize, setCurrentDimSize] =
      useState<DimensionSize>(initDimSize);
    const [overflow, setOverflow] = useState<Overflow>(initOverflow);
    const [useTransitions, setUseTransitions] = useState<boolean>(false);
    const [animationStateClassNames, setAnimationStateClassNames] =
      useState<string>(getStaticStateClasses(stateClasses.current, dimSize));

    // ------------------ Did mount
    useEffect(() => {
      // Hide content if dim size is 0 (to prevent tabbing into it)
      hideContent(contentElement.current, currentDimSize);

      // This should be explicitly run only on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ------------------ Dim size update
    useEffect(() => {
      if (dimSize !== prevDimSize.current && contentElement.current) {
        showContent(contentElement.current, prevDimSize.current);

        // Cache content dim size
        contentElement.current.style.overflow = 'hidden';
        const contentDimSize = isHeight
          ? contentElement.current.offsetHeight
          : contentElement.current.offsetWidth;
        contentElement.current.style.overflow = '';

        // set total animation time
        const totalDuration = duration + delay;

        let newDimSize: DimensionSize;
        let timeoutDimSize: DimensionSize;
        let timeoutOverflow: Overflow = 'hidden';
        let timeoutUseTransitions: boolean;

        const isCurrentDimSizeAuto = prevDimSize.current === 'auto';

        if (typeof dimSize === 'number') {
          // Reset negative dimSize to 0
          newDimSize = dimSize < 0 ? 0 : dimSize;
          timeoutDimSize = newDimSize;
        } else if (isPercentage(dimSize)) {
          // If value is string "0%" make sure we convert it to number 0
          newDimSize = dimSize === '0%' ? 0 : dimSize;
          timeoutDimSize = newDimSize;
        } else {
          // If not, animate to content dim size
          // and then reset to auto
          newDimSize = contentDimSize; // TODO solve contentDimSize = 0
          timeoutDimSize = 'auto';
          timeoutOverflow = undefined;
        }

        if (isCurrentDimSizeAuto) {
          // This is the dim size to be animated to
          timeoutDimSize = newDimSize;

          // If previous dim size was 'auto'
          // set starting dim size explicitly to be able to use transition
          newDimSize = contentDimSize;
        }

        // Animation classes
        const newAnimationStateClassNames = [
          stateClasses.current.animating,
          (prevDimSize.current === 'auto' || dimSize < prevDimSize.current) &&
            stateClasses.current.animatingUp,
          (dimSize === 'auto' || dimSize > prevDimSize.current) &&
            stateClasses.current.animatingDown,
          timeoutDimSize === 0 && stateClasses.current.animatingToDimZero,
          timeoutDimSize === 'auto' && stateClasses.current.animatingToDimAuto,
          typeof timeoutDimSize === 'number' && timeoutDimSize > 0
            ? stateClasses.current.animatingToDimSpecific
            : null,
        ]
          .filter((v) => v)
          .join(' ');

        // Animation classes to be put after animation is complete
        const timeoutAnimationStateClasses = getStaticStateClasses(
          stateClasses.current,
          timeoutDimSize
        );

        // Set starting dim size and animating classes
        // When animating from 'auto' we first need to set fixed dim size
        // that change should be animated
        setCurrentDimSize(newDimSize);
        setOverflow('hidden');
        setUseTransitions(!isCurrentDimSizeAuto);
        setAnimationStateClassNames(newAnimationStateClassNames);

        // Clear timeouts
        clearTimeout(timeoutID.current as Timeout);
        clearTimeout(animationClassesTimeoutID.current as Timeout);

        if (isCurrentDimSizeAuto) {
          // When animating from 'auto' we use a short timeout to start animation
          // after setting fixed dim size above
          timeoutUseTransitions = true;

          // Short timeout to allow rendering of the initial animation state first
          timeoutID.current = setTimeout(() => {
            setCurrentDimSize(timeoutDimSize);
            setOverflow(timeoutOverflow);
            setUseTransitions(timeoutUseTransitions);

            // ANIMATION STARTS, run a callback if it exists
            onDimAnimationStart?.(timeoutDimSize);
          }, 50);

          // Set static classes and remove transitions when animation ends
          animationClassesTimeoutID.current = setTimeout(() => {
            setUseTransitions(false);
            setAnimationStateClassNames(timeoutAnimationStateClasses);

            // ANIMATION ENDS
            // Hide content if dim size is 0 (to prevent tabbing into it)
            hideContent(contentElement.current, timeoutDimSize);
            // Run a callback if it exists
            onDimAnimationEnd?.(timeoutDimSize);
          }, totalDuration);
        } else {
          // ANIMATION STARTS, run a callback if it exists
          onDimAnimationStart?.(newDimSize);

          // Set end dim size, classes and remove transitions when animation is complete
          timeoutID.current = setTimeout(() => {
            setCurrentDimSize(timeoutDimSize);
            setOverflow(timeoutOverflow);
            setUseTransitions(false);
            setAnimationStateClassNames(timeoutAnimationStateClasses);

            // ANIMATION ENDS
            // If dim size is auto, don't hide the content
            // (case when element is empty, therefore dim size is 0)
            if (dimSize !== 'auto') {
              // Hide content if dim size is 0 (to prevent tabbing into it)
              hideContent(contentElement.current, newDimSize); // TODO solve newDimSize = 0
            }
            // Run a callback if it exists
            onDimAnimationEnd?.(newDimSize);
          }, totalDuration);
        }
      }

      prevDimSize.current = dimSize;

      return () => {
        clearTimeout(timeoutID.current as Timeout);
        clearTimeout(animationClassesTimeoutID.current as Timeout);
      };

      // This should be explicitly run only on dim size change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dimSize]);

    // ------------------ Render

    const componentStyle: CSSProperties = {
      ...style,
      ...{
        [isHeight ? 'height' : 'width']: currentDimSize,
      },
      // height: currentDimSize,
      overflow: overflow || style?.overflow,
    };

    if (useTransitions && applyInlineTransitions) {
      componentStyle.transition = `${
        isHeight ? 'height' : 'width'
      } ${duration}ms ${easing} ${delay}ms`;

      // Include transition passed through styles
      if (style?.transition) {
        componentStyle.transition = `${style.transition}, ${componentStyle.transition}`;
      }

      // Add webkit vendor prefix still used by opera, blackberry...
      componentStyle.WebkitTransition = componentStyle.transition;
    }

    const contentStyle: CSSProperties = {};

    if (animateOpacity) {
      contentStyle.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
      // Add webkit vendor prefix still used by opera, blackberry...
      contentStyle.WebkitTransition = contentStyle.transition;

      if (currentDimSize === 0) {
        contentStyle.opacity = 0;
      }
    }

    // Check if user passed aria-hidden prop
    const hasAriaHiddenProp = typeof divProps['aria-hidden'] !== 'undefined';
    const ariaHidden = hasAriaHiddenProp
      ? divProps['aria-hidden']
      : dimSize === 0;

    return (
      <div
        {...divProps}
        aria-hidden={ariaHidden}
        className={`${animationStateClassNames} ${className}`}
        style={componentStyle}
        ref={ref}
      >
        <div
          className={contentClassName}
          style={contentStyle}
          ref={(el: HTMLDivElement) => {
            contentElement.current = el;

            if (contentRef) {
              contentRef.current = el;
            }
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

export const AnimateHeight: React.FC<
  Omit<React.ComponentProps<typeof AnimateDim>, 'dim' | 'dimSize'> & {
    height: DimensionSize;
  }
> = (props) => <AnimateDim dim="height" dimSize={props.height} {...props} />;

export const AnimateWidth: React.FC<
  Omit<React.ComponentProps<typeof AnimateDim>, 'dim' | 'dimSize'> & {
    width: DimensionSize;
  }
> = (props) => <AnimateDim dim="width" dimSize={props.width} {...props} />;
