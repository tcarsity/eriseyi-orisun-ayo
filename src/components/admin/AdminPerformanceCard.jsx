import React from "react";
import { useAdminPerformance } from "../../hooks/useAdminPerfomance";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdRecentActors } from "react-icons/md";
dayjs.extend(relativeTime);

const AdminPerformanceCard = () => {
  const { data: activities = [], isError } = useAdminPerformance();
  return (
    <div className="card border-0 shadow p-3 h-100">
      <h4 className="fw-bold mb-3">
        <MdRecentActors size={40} className="text-primary" /> Your recent
        activity
      </h4>

      {isError ? (
        <p className="text-danger text-center py-5">
          Failed tol load activities.
        </p>
      ) : activities.length === 0 ? (
        <p className="text-muted mb-0">No activity recorded yet</p>
      ) : (
        <ul className="list-group list-group-flush">
          {activities.slice(0, 5).map((a) => (
            <li
              key={a.id}
              className="list-group-item px-0 d-flex justify-content-between"
            >
              <div>
                <strong>{a.action}</strong>
                <div className="text-muted small">{a.details}</div>
              </div>
              <small className="text-muted">
                {dayjs(a.created_at).fromNow()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPerformanceCard;
