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
                  We are a Christ-centered church committed to raising believers
                  through faith, prayer, and the undiluted Word of God. At C & S
                  Eriseyi Orisun Ayo Agbara Kan-Naa, lives are transformed, hope
                  is restored, and God’s power is made manifest for all who seek
                  Him.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <h3 className="mb-3">Our Services</h3>
              <ul>
                <li>Tuesday Shiloh : 10:00am to 2:00pm</li>
                <li>Friday Vigil : 12:00am to 4:00am</li>
                <li>Sunday School : 9:00am to 10:00am</li>
                <li>Sunday Service : 10:00am to 2:00pm</li>
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
                  <p>
                    Call us:{""}
                    <a href="tel:+2349123954039">+234 912 395 4039</a>
                    <a href="tel:+2348064571986">+234 806 457 1986</a>
                  </p>
                </li>

                <li>
                  <p>
                    <a href="malito:eriseyicschurch@gmail.com">
                      eriseyicschurch@gmail.com
                    </a>
                  </p>
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
