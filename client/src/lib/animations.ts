export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  type: "tween" | "spring",
  delay: number,
  duration: number
) => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type,
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};

export const slideIn = (
  direction: "up" | "down" | "left" | "right",
  type: "tween" | "spring",
  delay: number,
  duration: number
) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type,
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};

export const scale = (delay: number, duration: number) => {
  return {
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};
