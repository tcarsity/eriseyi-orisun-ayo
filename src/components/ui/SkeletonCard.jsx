import React from "react";

import "./skeleton.css";

const SkeletonCard = ({ type = "list", count = 3 }) => {
  return (
    <div className="card shadow border-0 p-3">
      <div className="skeleton-title mb-3"></div>

      {type === "list" &&
        Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-item mb-3">
            <div className="skeleton-line w-50"></div>

            <div className="skeleton-line w-75 mt-2"></div>
          </div>
        ))}

      {type === "stats" && (
        <div className="text-center">
          <div className="skeleton-circle mx-auto mb-3"></div>
          <div className="skeleton-line w-50 mx-auto"></div>
          <div className="skeleton-line w-75 mx-auto mt-2"></div>
        </div>
      )}
    </div>
  );
};

export default SkeletonCard;
