import { Component, CSSProperties } from "react";

export interface AnimationStateClasses {
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

export interface AnimateHeightProps {
  animationStateClasses?: AnimationStateClasses;
  applyInlineTransitions?: boolean;
  className?: string;
  contentClassName?: string;
  duration?: number;
  easing?: string;
  height?: string | number;
  onAnimationEnd?(): void;
  onAnimationStart?(): void;
  style?: CSSProperties;
}

declare class AnimateHeight extends Component<AnimateHeightProps> {}

export default AnimateHeight;
