import { motion } from "framer-motion";
import React from "react";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import DashboardSkeleton from "../ui/DashboardSkeleton";

const DashboardAdminActivityCard = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <DashboardSkeleton variant="list" rows={5} />;
  }

  if (error) {
    return (
      <div className="card shadow border-0 p-3 text-center text-danger">
        Failed to load admin activity
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="card shadow border-0 p-3 text-center">
        <p className="text-muted fw-bold mb-0">No Admin Data Available</p>
      </div>
    );
  }
  return (
    <div className="card shadow border-0 p-3">
      <h6 className="text-muted mb-3">
        <RiAdminFill className="me-2 text-primary" />
        Admin Activity
      </h6>

      <div className="list-group small">
        {data.map((admin) => (
          <motion.div
            key={admin.id}
            className="list-group-item border-0 px-0 py-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <FaUsers className=" text-success" />
                  <strong>{admin.name}</strong>
                </div>
                <h6 className="mt-2">{admin.members_created} members</h6>
              </div>

              <div className="text-end">
                <div className="d-flex align-items-center gap-2 justify-content-end">
                  <FaCalendarAlt className=" text-info" />
                  <strong>Events</strong>
                </div>
                <h6 className="mt-2"> {admin.events_created} events</h6>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DashboardAdminActivityCard);
