import { Component, CSSProperties, ReactNode, HTMLAttributes } from "react"

export type AnimationStateClasses = {
  animating?: string;
  animatingUp?: string;
  animatingDown?: string;
  animatingToHeightZero?: string;
  animatingToHeightAuto?: string;
  animatingToHeightSpecific?: string;
  static?: string;
  staticHeightZero?: string;
  staticHeightAuto?: string;
  staticHeightSpecific?: string;
}

type OmitTypeProps<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type DivWithNoAnimationCallbacks = OmitTypeProps<OmitTypeProps<HTMLAttributes<HTMLDivElement>, 'onAnimationStart'>, 'onAnimationEnd'>

export type AnimateHeightProps = DivWithNoAnimationCallbacks & {
  'aria-hidden'?: boolean;
  animateOpacity?: boolean;
  animationStateClasses?: AnimationStateClasses;
  applyInlineTransitions?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
  contentClassName?: string;
  delay?: number;
  duration?: number;
  easing?: "ease" | "linear" | "ease-in" | "ease-out" | "ease-in-out" | string;
  height?: string | number;
  id?: string;
  onAnimationEnd?(props: { newHeight: number }): void;
  onAnimationStart?(props: { newHeight: number }): void;
  style?: CSSProperties;
}

declare class AnimateHeight extends Component<AnimateHeightProps> {}

export default AnimateHeight;
