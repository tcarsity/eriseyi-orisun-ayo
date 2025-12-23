import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import api from "../../api/axios";
import { useQuery } from "@tanstack/react-query";

const Testimonial = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicTestimonials"],
    queryFn: async () => {
      const res = await api.get("/public-testimonials");
      return res.data.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  return (
    <>
      <section className="section-5 py-5 bg-light" id="testimonials">
        <div className="container py-5">
          <div className="section-header text-center">
            <span>Testimonials</span>
            <h2>What our members are saying about the church.</h2>
            <p>
              Every testimony is a reflection of God’s faithfulness. Through
              worship, teaching, and community, lives have been touched,
              restored, and renewed. These stories represent the work of God in
              our midst and encourage us to trust Him more.
            </p>
          </div>

          {isLoading && (
            <h5 className="text-center text-muted fw-bold">
              Loading testimonial...
            </h5>
          )}

          {isError && (
            <h5 className="text-center text-danger fw-bold">
              Failed to load testimonial.
            </h5>
          )}

          {!isLoading && !isError && (!data || data.length === 0) && (
            <h5 className="text-center text-muted fw-bold">
              No Testimonial available yet.
            </h5>
          )}

          {!isLoading && !isError && data?.length > 0 && (
            <Swiper
              modules={[Pagination]}
              spaceBetween={50}
              slidesPerView={3}
              pagination={{ clickable: true }}
              breakpoints={{
                200: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },

                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },

                1024: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
            >
              {data.map((testimonial) => (
                <SwiperSlide>
                  <div className={`card shadow border-0 h-100 `}>
                    <div className="card-body p-4">
                      <div className="rating">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                      </div>
                      <div className="content pt-4 pb-2">
                        <p>{testimonial.message}</p>
                      </div>
                      <hr />
                      <div className="d-flex meta">
                        <div>
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            width={50}
                          />
                        </div>
                        <div className="ps-3">
                          <div className="name">{testimonial.author}</div>
                          <div>{testimonial.designation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </>
  );
};

export default React.memo(Testimonial);
