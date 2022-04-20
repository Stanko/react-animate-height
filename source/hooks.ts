import cx from "classnames";
import { useMemo, useCallback, useEffect } from "react";
import { isNumber, isPercentage } from "./utils.js";
import type { AnimationStateClasses } from "./types.js";

export function useTimings(
  delay: number,
  duration: number
): { delay: number; duration: number } {
  const reducedMotion = useMemo(prefersReducedMotion, []);
  return useMemo(
    () =>
      reducedMotion
        ? {
            delay: 0,
            duration: 0,
          }
        : {
            delay,
            duration,
          },
    [delay, duration, reducedMotion]
  );
}

export function useStaticStateClasses(
  animationStateClasses: AnimationStateClasses,
  height: number | string
): string {
  return useMemo(
    () =>
      cx({
        [animationStateClasses.static]: true,
        [animationStateClasses.staticHeightZero]: height === 0,
        [animationStateClasses.staticHeightSpecific]: height > 0,
        [animationStateClasses.staticHeightAuto]: height === "auto",
      }),
    [animationStateClasses, height]
  );
}

function prefersReducedMotion(): boolean {
  const isBrowser = typeof window !== "undefined";
  return (
    isBrowser &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion)").matches
  );
}

export function useShowContentCallback(
  contentElement: React.RefObject<HTMLDivElement>
) {
  return useCallback(
    (height: number | string) => {
      if (height !== 0) {
        contentElement.current.style.display = "";
      }
    },
    [contentElement]
  );
}

export function useHideContentCallback(
  contentElement: React.RefObject<HTMLDivElement>
) {
  return useCallback(
    (height: number | string) => {
      if (height === 0) {
        contentElement.current.style.display = "none";
      }
    },
    [contentElement]
  );
}

/**
 * Hide content if height is 0 (to prevent tabbing into it)
 * Check for contentElement is added cause this would fail in tests (react-test-renderer)
 * Read more here: https://github.com/Stanko/react-animate-height/issues/17
 * @param contentElement
 * @param height
 * @returns
 */
export function useMountingEffect(
  contentElement: React.RefObject<HTMLDivElement>,
  height: string | number
) {
  return (
    useEffect(() => {
      if (this.contentElement && this.contentElement.style) {
        this.hideContent(height);
      }
    }),
    // intentional, only fire when the contentElement is hydrated
    [contentElement]
  );
}

export function useParsedHeight(
  heightProp: number | string
): [number | string, string] {
  return useMemo(() => {
    let height = "auto";
    let overflow = "visible";
    if (isNumber(heightProp)) {
      // If value is string "0" make sure we convert it to number 0
      heightProp = heightProp < 0 || heightProp === "0" ? 0 : heightProp;
      overflow = "hidden";
    } else if (isPercentage(heightProp)) {
      // If value is string "0%" make sure we convert it to number 0
      heightProp = heightProp === "0%" ? 0 : heightProp;
      overflow = "hidden";
    }
    return [height, overflow];
  }, [heightProp]);
}
