import React from "react";
import ShilohImg from "../../assets/images/shiloh.webp";
import VigilImg from "../../assets/images/vigil.webp";
import TeachImg from "../../assets/images/teach.webp";
import SundayImg from "../../assets/images/sunday.webp";
import AnimatedCard from "../../animation/AnimatedCard";

const Service = () => {
  return (
    <>
      <section className="section-3 bg-light py-5" id="services">
        <div className="container-fluid py-5">
          <div className="section-header text-center">
            <span>our services</span>
            <h2>Our Church Services</h2>
            <p>We welcome you all to join us and praise the lord.</p>
          </div>
          <div className="row pt-4">
            <div className="col-md-6 col-lg-3">
              <AnimatedCard delay={0.1}>
                <div className="item">
                  <div className="service-image">
                    <img
                      src={ShilohImg}
                      alt=""
                      className="w-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="service-body">
                    <div className="service-title">
                      <h4>Every Tuesday: Shiloh Service </h4>
                    </div>
                    <div className="service-content">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloribus repudiandae quos doloremque.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="col-md-6 col-lg-3">
              <AnimatedCard delay={0.2}>
                <div className="item">
                  <div className="service-image">
                    <img
                      src={VigilImg}
                      alt=""
                      className="w-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="service-body">
                    <div className="service-title">
                      <h4>Every Friday: Vigil Service </h4>
                    </div>
                    <div className="service-content">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloribus repudiandae quos doloremque.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="col-md-6 col-lg-3">
              <AnimatedCard delay={0.3}>
                <div className="item">
                  <div className="service-image">
                    <img
                      src={TeachImg}
                      alt=""
                      className="w-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="service-body">
                    <div className="service-title">
                      <h4>Every Sunday: Sunday School </h4>
                    </div>
                    <div className="service-content">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloribus repudiandae quos doloremque.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="col-md-6 col-lg-3">
              <AnimatedCard delay={0.4}>
                <div className="item">
                  <div className="service-image">
                    <img
                      src={SundayImg}
                      alt=""
                      className="w-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="service-body">
                    <div className="service-title">
                      <h4>Every Sunday: Sunday Service </h4>
                    </div>
                    <div className="service-content">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloribus repudiandae quos doloremque.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Service;
