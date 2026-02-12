import React from "react";
import "./skeleton.css";

const DashboardSkeleton = ({
  variant = "list",
  rows = 3,
  showHeader = true,
  className = "",
}) => {
  return (
    <div className={`card shadow border-0 p-3 ${className}`}>
      {showHeader && <div className="skeleton-title mb-3"></div>}

      {variant === "list" &&
        Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="w-75">
              <div className="skeleton-line w-50 mb-2"></div>
              <div className="skeleton-line w-75"></div>
            </div>
            <div className="skeleton-badge"></div>
          </div>
        ))}

      {variant === "stats" && (
        <div className="text-center">
          <div className="skeleton-circle mx-auto mb-3"></div>
          <div className="skeleton-line w-50 mx-auto mb-2"></div>
          <div className="skeleton-line w-75 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default DashboardSkeleton;
