import React, { useEffect } from "react";
import logo from "../assets/images/logo.jpg";

const Preloader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("site_loaded", "true");
      onFinish();
    }, 2500); // duration before site shows

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="preloader">
      <img src={logo} alt="Logo" className="preloader-logo" />
    </div>
  );
};

export default Preloader;
