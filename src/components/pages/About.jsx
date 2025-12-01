import React from "react";
import AboutImg from "../../assets/images/church.webP";
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
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Voluptates alias, hic sapiente aliquam at nulla totam quasi
                  cumque commodi quo, tempora quam pariatur aperiam veritatis ad
                  nihil provident tempore? Nisi. Lorem ipsum dolor sit, amet
                  consectetur adipisicing elit. Accusantium cupiditate deserunt
                  illum vero, deleniti blanditiis quas dicta, aliquid quos
                  provident quia officia modi. Magnam eos velit veniam beatae
                  rerum deserunt!
                </p>
                <p className="float-item">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                  quae quis voluptate accusamus neque aut odit assumenda eius,
                  quo, sint nesciunt consequuntur iure. Recusandae corporis quam
                  hic asperiores magnam maxime? Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Enim deserunt illo eligendi at
                  accusamus dicta adipisci aliquid iste? Quae debitis assumenda
                  laboriosam amet temporibus odit necessitatibus neque nemo
                  sapiente sunt!
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
