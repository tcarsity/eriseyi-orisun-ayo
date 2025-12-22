import React from "react";
import logo from "../assets/images/logo.png";

const Preloader = () => {
  return (
    <div className="preloader">
      <img src={logo} alt="Logo" className="preloader-logo" />
    </div>
  );
};

export default Preloader;
