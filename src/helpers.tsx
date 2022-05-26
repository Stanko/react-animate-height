import classNames from 'classnames';
import { Height, AnimationStateClasses } from '.';

export function isNumber(n: string) {
  const number = parseFloat(n);
  return !isNaN(number) && isFinite(number);
}

export function isPercentage(height: Height) {
  // Percentage height
  return (
    typeof height === 'string' &&
    height[height.length - 1] === '%' &&
    isNumber(height.substring(0, height.length - 1))
  );
}

export function hideContent(element: HTMLDivElement | null, height: Height) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (height === 0 && element?.style) {
    element.style.display = 'none';
  }
}

export function showContent(element: HTMLDivElement | null, height: Height) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (height === 0 && element?.style) {
    element.style.display = '';
  }
}

// Start animation helper using nested requestAnimationFrames
export function startAnimationHelper(callback: () => any) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
}

export const ANIMATION_STATE_CLASSES: AnimationStateClasses = {
  animating: 'rah-animating',
  animatingUp: 'rah-animating--up',
  animatingDown: 'rah-animating--down',
  animatingToHeightZero: 'rah-animating--to-height-zero',
  animatingToHeightAuto: 'rah-animating--to-height-auto',
  animatingToHeightSpecific: 'rah-animating--to-height-specific',
  static: 'rah-static',
  staticHeightZero: 'rah-static--height-zero',
  staticHeightAuto: 'rah-static--height-auto',
  staticHeightSpecific: 'rah-static--height-specific',
};

export function getStaticStateClasses(
  animationStateClasses: AnimationStateClasses,
  height: Height
) {
  return classNames({
    [animationStateClasses.static]: true,
    [animationStateClasses.staticHeightZero]: height === 0,
    [animationStateClasses.staticHeightSpecific]: height > 0,
    [animationStateClasses.staticHeightAuto]: height === 'auto',
  });
}
