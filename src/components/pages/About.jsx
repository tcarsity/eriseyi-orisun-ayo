import React from "react";
import AboutImg from "../../assets/images/church.webp";
import ScrollFloat from "../../animation/ScrollFloat";

const About = () => {
  return (
    <>
      <section className="section-2 py-5" id="about" tabIndex="-1">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <ScrollFloat direction="left">
                <img src={AboutImg} alt="" className="float-item w-100" />
              </ScrollFloat>
            </div>
            <div className="col-md-12 col-lg-6 content">
              <ScrollFloat>
                <span className="float-item d-block">about the church</span>
                <h2 className="float-item">Our journey so far with God.</h2>
                <p className="float-item">
                  We are a Christ-centered church committed to spreading the
                  gospel, raising disciples, and building a community grounded
                  in faith, love, and service. Our mission is to lead people
                  into a growing relationship with Jesus Christ while impacting
                  lives through worship, teaching, and outreach.
                </p>
                <p className="float-item">
                  We believe church is not just a place to attend, but a family
                  to belong to—where lives are transformed and purpose is
                  discovered.
                </p>
              </ScrollFloat>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
