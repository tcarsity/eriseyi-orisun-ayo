import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Hero = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, window.innerHeight], [10, -10]);
  const rotateY = useTransform(x, [0, window.innerWidth], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);
  return (
    <>
      <section className="section-1">
        <div className="hero d-flex align-items-center">
          <div className="hero__sweep"></div>
          <div className="container-fluid">
            <motion.div
              className="text-center"
              style={{ rotateX, rotateY, transformPerspective: 800 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="d-block mb-2"
              >
                Welcome Home
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Gather. Grow. Serve.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                A place where faith comes alive, hope is restored, and lives are
                transformed by the love of Christ.
              </motion.p>

              <Link to="/add-member" className="btn btn-primary">
                Be a Member
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
