import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

const DashboardEventsCard = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="card shadow border-0 p-4 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "2rem", height: "2rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow border-0 p-3 text-center text-danger">
        Failed to load events
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="card shadow-sm border-0 p-3 text-center">
        <p className="text-muted fw-bold mb-0">No Upcoming event Found</p>
      </div>
    );
  }
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="text-muted mb-3">
        <FaCalendarAlt className="me-2 text-primary" />
        Upcoming Events
      </h6>

      <div className="list-group small">
        {data?.slice(0, 4).map((event) => (
          <motion.div
            key={event.id}
            className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <strong>{event.title}</strong>
              <div className="text-muted small">
                Date: {new Date(event.event_date).toLocaleDateString()}
              </div>

              <div className="text-muted small">
                Time: {event.event_time && `🕛 ${event.event_time}`}
              </div>
            </div>

            <div className="text-end">
              <span className="badge bg-light text-dark">
                {event.creator?.name || "Superadmin"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DashboardEventsCard);
