import type { CSSProperties } from "react";
import type { AnimateHeightProps } from "./types.js";

export function omit(obj: object, ...keys: string[]) {
  if (!keys.length) {
    return obj;
  }

  const res = {};
  const objectKeys = Object.keys(obj);

  for (let i = 0; i < objectKeys.length; i++) {
    const key = objectKeys[i];

    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
  }

  return res;
}

// Start animation helper using nested requestAnimationFrames
export function startAnimationHelper(callback) {
  const requestAnimationFrameIDs = [];

  requestAnimationFrameIDs[0] = requestAnimationFrame(() => {
    requestAnimationFrameIDs[1] = requestAnimationFrame(() => {
      callback();
    });
  });

  return requestAnimationFrameIDs;
}

export function cancelAnimationFrames(requestAnimationFrameIDs) {
  requestAnimationFrameIDs.forEach((id) => cancelAnimationFrame(id));
}

export function isNumber(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

export function isPercentage(height) {
  // Percentage height
  return (
    typeof height === "string" &&
    height.search("%") === height.length - 1 &&
    isNumber(height.substr(0, height.length - 1))
  );
}

export function runCallback(callback, params) {
  if (callback && typeof callback === "function") {
    callback(params);
  }
}

export function parseHeight(
  heightProp: string | number
): [string | number, string] {
  let height: string | number = "auto";
  let overflow = "visible";

  if (isNumber(heightProp)) {
    // If value is string "0" make sure we convert it to number 0
    height = heightProp < 0 || heightProp === "0" ? 0 : heightProp;
    overflow = "hidden";
  } else if (isPercentage(heightProp)) {
    // If value is string "0%" make sure we convert it to number 0
    height = heightProp === "0%" ? 0 : heightProp;
    overflow = "hidden";
  }

  return [height, overflow];
}

export function prefersReducedMotion(): boolean {
  const isBrowser = typeof window !== "undefined";
  return (
    isBrowser &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion)").matches
  );
}

export function isAriaHidden(
  ariaHiddenProp: boolean | undefined,
  height: string | number
): boolean {
  // Check if user passed aria-hidden prop
  const hasAriaHiddenProp = typeof ariaHiddenProp !== "undefined";
  return hasAriaHiddenProp ? ariaHiddenProp : height === 0;
}

export function getContentStyle(
  height: string | number,
  animateOpacity: boolean,
  duration: number,
  delay: number,
  easing: AnimateHeightProps["easing"]
): CSSProperties {
  const contentStyle: CSSProperties = {};

  if (animateOpacity) {
    contentStyle.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
    // Add webkit vendor prefix still used by opera, blackberry...
    contentStyle.WebkitTransition = contentStyle.transition;

    if (height === 0) {
      contentStyle.opacity = 0;
    }
  }

  return contentStyle;
}

export function getTimings(
  delay: number,
  duration: number,
  prefersReduced: boolean
) {
  return prefersReduced ? { delay: 0, duration: 0 } : { delay, duration };
}
