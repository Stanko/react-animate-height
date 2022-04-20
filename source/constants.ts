export const ANIMATION_STATE_CLASSES = {
  animating: "rah-animating",
  animatingUp: "rah-animating--up",
  animatingDown: "rah-animating--down",
  animatingToHeightZero: "rah-animating--to-height-zero",
  animatingToHeightAuto: "rah-animating--to-height-auto",
  animatingToHeightSpecific: "rah-animating--to-height-specific",
  static: "rah-static",
  staticHeightZero: "rah-static--height-zero",
  staticHeightAuto: "rah-static--height-auto",
  staticHeightSpecific: "rah-static--height-specific",
};

export const PROPS_TO_OMIT = [
  "animateOpacity",
  "animationStateClasses",
  "applyInlineTransitions",
  "children",
  "contentClassName",
  "delay",
  "duration",
  "easing",
  "height",
  "onAnimationEnd",
  "onAnimationStart",
];
