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

export type AnimateHeightProps = {
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
  onAnimationEnd?(props: { newHeight: number }): void;
  onAnimationStart?(props: { newHeight: number }): void;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>

declare class AnimateHeight extends Component<AnimateHeightProps> {}

export default AnimateHeight;
