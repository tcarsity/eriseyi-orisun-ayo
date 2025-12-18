import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React from "react";
import api from "../../api/axios";

const EventsSection = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  return (
    <>
      <section className="section-event py-5" id="event">
        <div className="container py-5">
          <div className="section-header text-center">
            <span>Events</span>
            <h2>Upcoming Events</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>

          {isLoading && (
            <h5 className="text-center text-muted fw-bold">
              Loading events...
            </h5>
          )}

          {isError && (
            <h5 className="text-center text-danger fw-bold">
              Failed to load events.
            </h5>
          )}

          {!isLoading && !isError && (!data || data.length === 0) && (
            <h5 className="text-center text-muted fw-bold">
              No Event available yet.
            </h5>
          )}

          {!isLoading && !isError && data?.length > 0 && (
            <div className="row g-4 mt-4 events-grid">
              {data.map((event) => (
                <div className="col-md-6 col-lg-3" key={event.id}>
                  <motion.div
                    className="card border-0 shadow h-100 event-card"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img
                      src={event.image || "/assets/placeholder.jpg"}
                      alt={event.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                      <h5 className="fw-bold">{event.title}</h5>
                      <p className="text-muted mb-2">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                      {event.event_time && (
                        <p className="text-muted mb-2">🕛 {event.event_time}</p>
                      )}
                      <p className="text-secondary small">
                        {event.description?.slice(0, 80)}...
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EventsSection;
