import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const AnimatedCard = React.memo(({ children, delay = 0 }) => {
  const rotateX = useMotionValue(15);
  const rotateY = useMotionValue(-15);
  const opacity = useTransform(rotateX, [-15, 15], [0.8, 1]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const smoothY = y * 0.2;
          rotateX.set(15 - (smoothY % 30));
          rotateY.set(-15 + (smoothY % 30));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        opacity,
        transformStyle: "preverse-3d",
        willChange: "transform, opacity",
      }}
      initial={{
        opacity: 0,
        y: 60,
      }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
});

export default AnimatedCard;
