import React, { useEffect } from "react";
import logo from "../assets/images/logo.jpg";
import api from "../api/axios";

const Preloader = () => {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Example critical calls
        await Promise.all([
          api.get("/me"), // auth check
          api.get("/testimonials"), // homepage data
          api.get("/events"), // homepage data
        ]);
      } catch (error) {
        console.error("App init error:", error);
      } finally {
        setAppReady(true);
      }
    };

    prepareApp();
  }, []);

  return (
    <div className="preloader">
      <img src={logo} alt="Logo" className="preloader-logo" />
    </div>
  );
};

export default Preloader;
