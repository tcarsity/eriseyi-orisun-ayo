import React from "react";
import logo from "../assets/images/logo.jpg";

const Preloader = ({ progress }) => {
  return (
    <div className="preloader">
      {/* Center logo */}
      <div className="preloader-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* Bottom text + percentage */}
      <div className="preloader-footer">
        <span className="left-text">Brewing your experience</span>
        <span className="right-text">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Preloader;
