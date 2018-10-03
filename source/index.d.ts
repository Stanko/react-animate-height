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
  animateOpacity?: boolean;
  animationStateClasses?: AnimationStateClasses;
  applyInlineTransitions?: boolean;
  children: any;
  className?: string;
  contentClassName?: string;
  delay?: number;
  duration?: number;
  easing?: string;
  height?: string | number;
  onAnimationEnd?(): void;
  onAnimationStart?(): void;
  style?: CSSProperties;
}

declare class AnimateHeight extends Component<AnimateHeightProps> {}

export default AnimateHeight;
