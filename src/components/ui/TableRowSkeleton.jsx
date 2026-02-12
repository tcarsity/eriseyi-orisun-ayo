import React from "react";
import "./skeleton.css";

const TableRowSkeleton = ({ rows = 8, columns = 9 }) => {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={`skeleton-${i}`}>
      {Array.from({ length: columns }).map((_, j) => (
        <td key={j}>
          <div className="skeleton-line w-100"></div>
        </td>
      ))}
    </tr>
  ));
};

export default TableRowSkeleton;
