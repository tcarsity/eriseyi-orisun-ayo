import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stagger } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ShepherdFloat = ({
  children,
  y = 80,
  x = 0,
  duration = 1.5,
  stagger = 0.12,
  ease = "power3.out",
  start = "top 85%",
  end = "bottom 60%",
  direction = "up", // 'up' | 'left' | 'right'
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(".float-item", containerRef.current);

      elements.forEach((el, i) => {
        const fromVars =
          direction === "up"
            ? { opacity: 0, y }
            : direction === "right"
            ? { opacity: 0, x: -y }
            : { opacity: 0, x: y };

        gsap.fromTo(el, fromVars, {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          ease,

          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 1,
            toggleActions: "play reverse play reverse",
          },

          delay: i * stagger,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [y, duration, stagger, ease, start, end, direction]);

  return <div ref={containerRef}>{children}</div>;
};

export default ShepherdFloat;
