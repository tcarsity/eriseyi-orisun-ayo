import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { supabase } from "../../lib/supabase";

const EventsSection = () => {
  const [expandedEventId, setExpandedEventId] = useState(null);
  const queryClient = useQueryClient();

  const { data = [], isError } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/public-events");
      return res.data.data;
    },
  });

  const featuredEvent = data?.length > 0 ? data[0] : null;
  const upcomingEvents = data?.length > 1 ? data.slice(1) : [];

  useEffect(() => {
    const channel = supabase
      .channel("public-events-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          queryClient.invalidateQueries(["events"]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <>
      <section className="section-event py-5" id="event">
        <div className="container py-5">
          <div className="section-header text-center">
            <span>Events</span>
            <h2>Upcoming Events</h2>
            <p>
              Join us for upcoming events designed to strengthen faith, build
              fellowship, and encourage spiritual growth. From worship
              gatherings to special programs, there’s always something happening
              for everyone. Stay connected and be part of what God is doing.
            </p>
          </div>

          {isError && (
            <h5 className="text-center text-danger fw-bold">
              Failed to load events.
            </h5>
          )}

          {!isError && (!data || data.length === 0) && (
            <h5 className="text-center text-muted fw-bold">
              No Event available yet.
            </h5>
          )}

          {!isError && data?.length > 0 && (
            <div className="events-editorial mt-5">
              {/* Featured Event */}
              {featuredEvent && (
                <motion.div
                  className="featured-event card border-0 shadow mb-5"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="row g-0 align-items-center">
                    <div className="col-md-6">
                      <img
                        src={featuredEvent.image || "/assets/placeholder.jpg"}
                        alt={featuredEvent.title}
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: "cover", minHeight: "300px" }}
                      />
                    </div>

                    <div className="col-md-6 p-4">
                      <span className="badge bg-primary mb-2">
                        Featured Event
                      </span>
                      <h3 className="fw-bold">{featuredEvent.title}</h3>
                      <p className="text-muted mb-2">
                        {new Date(featuredEvent?.event_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",

                            month: "2-digit",

                            year: "numeric",
                          },
                        )}{" "}
                        •{" "}
                        {featuredEvent?.event_time &&
                          new Date(
                            `1970-01-01T${featuredEvent?.event_time}`,
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",

                            minute: "2-digit",

                            hour12: true,
                          })}
                      </p>
                      <p className="text-secondary small">
                        {expandedEventId === featuredEvent?.id
                          ? featuredEvent?.description
                          : featuredEvent?.description?.slice(0, 120)}

                        {featuredEvent?.description?.length > 120 && (
                          <span
                            className="text-primary fw-semibold ms-1"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setExpandedEventId(
                                expandedEventId === featuredEvent?.id
                                  ? null
                                  : featuredEvent?.id,
                              )
                            }
                          >
                            {expandedEventId === featuredEvent?.id
                              ? " See less"
                              : "... See more"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="upcoming-events">
                  <h4 className="fw-bold mb-3">More Upcoming Events</h4>
                  <ul className="list-group list-group-flush">
                    {upcomingEvents.map((event) => (
                      <li
                        key={event.id}
                        className="list-group-item d-flex justify-content-between align-items-center py-3"
                      >
                        <div>
                          <strong>{event.title}</strong>
                          <p className="text-muted mb-2">
                            {new Date(event.event_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",

                                month: "2-digit",

                                year: "numeric",
                              },
                            )}{" "}
                            •{" "}
                            {event.event_time &&
                              new Date(
                                `1970-01-01T${event.event_time}`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",

                                minute: "2-digit",

                                hour12: true,
                              })}
                          </p>
                        </div>
                        <span className="text-primary">→</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EventsSection;
