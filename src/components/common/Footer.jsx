import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      <footer>
        <div className="container py-5" id="contact">
          <div className="row foot">
            <div className="col-md-6 col-lg-4 foot-content">
              <h3>C & S Eriseyi Orisun Ayo Agbara Kan-Naa</h3>
              <div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Ducimus cum corrupti vero inventore atque cupiditate placeat
                  voluptate!
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <h3 className="mb-3">Our Services</h3>
              <ul>
                <li>Tuesday Shiloh</li>
                <li>Friday Vigil</li>
                <li>Sunday School</li>
                <li>Sunday Service</li>
              </ul>
            </div>

            {isHome && (
              <div className="col-md-6 col-lg-3">
                <h3 className="mb-3">Quick Links</h3>
                <ul>
                  <li>
                    <a href="#about">About The Church</a>
                  </li>

                  <li>
                    <a href="#services">Our Services</a>
                  </li>

                  <li>
                    <a href="#shepherd">The Shepherd</a>
                  </li>

                  <li>
                    <a href="#testimonials">Testimonials</a>
                  </li>
                  <li>
                    <a href="#event">Events</a>
                  </li>
                </ul>
              </div>
            )}

            <div className="col-md-6 col-lg-2">
              <h3 className="mb-3">Contact Us</h3>
              <ul>
                <li>
                  <a href="">000-8655-9876</a>
                </li>

                <li>
                  <a href="">info.example.com</a>
                </li>

                <p>
                  P.O Box 12344 <br />
                  14, address address str <br />
                  Lagos, Nigeria.
                </p>
              </ul>
            </div>
            <hr />
            <div className="text-center mt-4 copy">
              Copyright 2025 C &amp; S Orisun Ayo Agbara Kan-Naa. All Rights
              Reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default React.memo(Footer);
