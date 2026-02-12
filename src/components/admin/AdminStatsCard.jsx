import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashboardSkeleton from "../ui/DashboardSkeleton";

const AdminStatsCard = ({ active = 0, inactive = 0, isLoading }) => {
  if (isLoading) {
    return <DashboardSkeleton variant="stats" className="p-4 text-center" />;
  }

  const total = active + inactive;
  const activePercent = total > 0 ? (active / total) * 100 : 0;

  return (
    <div className="card shadow border-0 p-4 text-center h-100">
      <h5 className="mb-3 fw-bold">Admin Activity</h5>
      <div style={{ width: 120, height: 120, margin: "0 auto" }}>
        <CircularProgressbar
          value={activePercent}
          text={`${Math.round(activePercent)}%`}
          styles={buildStyles({
            textColor: "#111",
            pathColor:
              activePercent >= 75
                ? "#28a745"
                : activePercent >= 50
                  ? "#ffc107"
                  : "#dc3545",
            trailColor: "#e5e7eb",
          })}
        />
      </div>
      <div className="mt-3">
        <p className="mb-1 text-success">Active: {active}</p>
        <p className="mb-0 text-danger">Inactive: {inactive}</p>
      </div>
    </div>
  );
};

export default AdminStatsCard;
