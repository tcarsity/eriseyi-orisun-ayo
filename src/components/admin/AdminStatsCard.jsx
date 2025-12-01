import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AdminStatsCard = ({ active, inactive }) => {
  const total = active + inactive;
  const activePercent = total > 0 ? (active / total) * 100 : 0;

  return (
    <div className="card shadow border-0 p-4 text-center ">
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
