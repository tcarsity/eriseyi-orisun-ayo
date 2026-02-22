import React from "react";
import ShepherdFloat from "../../animation/ShepherdFloat";

const Shepherd = () => {
  return (
    <>
      <section className="section-4 py-5" id="shepherd">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-12 col-lg-6 content">
              <div className="section-header">
                <ShepherdFloat>
                  <span className="float-item d-block">about the shepherd</span>
                  <h2 className="float-item">Shepherd's journey with God.</h2>
                  <p className="float-item">
                    Our shepherd is a devoted servant of God with a heart for
                    people and a passion for teaching the Word with clarity and
                    truth. With years of ministry experience, he leads the
                    church with humility, wisdom, and a strong commitment to
                    spiritual growth and godly leadership.
                  </p>
                  <p className="float-item">
                    His vision is to see lives restored, faith strengthened, and
                    believers equipped to walk boldly in their God-given
                    purpose.
                  </p>
                </ShepherdFloat>
              </div>
            </div>
            {/* <div className="col-md-12 col-lg-6">
            <ScrollFloat direction="right">
              <img src="" alt="Picture of the shepherd T.A Olarewaju JP" className="float-item w-100" />
            </ScrollFloat>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Shepherd;
