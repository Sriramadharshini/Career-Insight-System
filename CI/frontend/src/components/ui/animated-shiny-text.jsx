import * as React from "react";
import { motion } from "framer-motion";

const textVariants = (duration) => ({
  initial: { backgroundPosition: "0 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear",
    },
  },
});

const AnimatedText = React.forwardRef(
  (
    {
      text,
      gradientColors = "linear-gradient(90deg, #38bdf8, #8b5cf6, #ec4899, #38bdf8)",
      gradientAnimationDuration = 3,
      hoverEffect = false,
      className = "",
      textClassName = "",
      style = {},
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        className={`animated-text-root ${className}`}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", ...style }}
        {...props}
      >
        <motion.h1
          className={`animated-text-heading ${textClassName}`}
          style={{
            background: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: isHovered ? "0 0 8px rgba(255,255,255,0.3)" : "none",
            margin: 0,
            padding: 0,
          }}
          variants={textVariants(gradientAnimationDuration)}
          initial="initial"
          animate="animate"
          onHoverStart={() => hoverEffect && setIsHovered(true)}
          onHoverEnd={() => hoverEffect && setIsHovered(false)}
        >
          {text}
        </motion.h1>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
