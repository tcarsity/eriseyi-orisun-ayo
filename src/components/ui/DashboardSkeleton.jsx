import React from "react";
import "./skeleton.css";

const DashboardSkeleton = ({
  variant = "list",
  rows = 3,
  columns = 4,
  showHeader = true,
  className = "h-100",
}) => {
  return (
    <div className={`card shadow border-0 p-3 ${className}`}>
      {showHeader && <div className="skeleton-title mb-3"></div>}

      {/* LIST VARIANT */}
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

      {/* STATS VARIANT */}
      {variant === "stats" && (
        <div className="text-center">
          <div className="skeleton-circle mx-auto mb-3"></div>
          <div className="skeleton-line w-50 mx-auto mb-2"></div>
          <div className="skeleton-line w-75 mx-auto"></div>
        </div>
      )}

      {/* TABLE VARIANT */}
      {variant === "table" && (
        <div>
          {/* Header row */}
          <div className="d-flex mb-3">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="skeleton-line flex-fill me-2"></div>
            ))}
          </div>

          {/* Body rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="d-flex mb-3">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="skeleton-line flex-fill me-2"
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSkeleton;
