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
                      alt="Members worshipping during Shiloh service at C & S Eriseyi Orisun Ayo"
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
                        Our Shiloh Service is a special time of prayer,
                        prophetic declarations, and divine encounters. Join us
                        every Tuesday from <strong>10:00am to 2:00pm</strong> as
                        we seek God’s presence for breakthrough, direction, and
                        restoration.
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
                      alt="Members worshipping during Vigil service at C & S Eriseyi Orisun Ayo"
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
                        Our Vigil Service is a powerful night of worship,
                        prayer, and spiritual warfare. We gather every Friday
                        from <strong>12:00am to 4:00am</strong> to wait on the
                        Lord, intercede, and experience supernatural renewal.
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
                      alt="Members learning during bible study at C & S Eriseyi Orisun Ayo"
                      className="w-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="service-body">
                    <div className="service-title">
                      <h4>Every Sunday: Bible Study </h4>
                    </div>
                    <div className="service-content">
                      <p>
                        Our Bible Study is a time of in-depth Bible teaching and
                        spiritual growth. Join us every Sunday from{" "}
                        <strong>9:00am to 10:00am</strong> as we study God’s
                        Word, build strong foundations, and grow together in
                        faith.
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
                      alt="Members worshipping during Sunday service at C & S Eriseyi Orisun Ayo"
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
                        Our Sunday Service is a joyful celebration of worship,
                        the Word, and fellowship. Join us every Sunday from{" "}
                        <strong>10:00am to 2:00pm</strong> for an uplifting
                        service filled with praise, teaching, and life-changing
                        encounters with God.
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
