import React from "react";
import logo from "../assets/images/logo.jpg";

const Preloader = ({ progress }) => {
  return (
    <div className="preloader">
      <img src={logo} alt="Logo" className="preloader-logo" />

      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }} />

        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
};

export default Preloader;
