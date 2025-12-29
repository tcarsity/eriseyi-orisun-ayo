import React from "react";
import { useAdminStatus } from "../../hooks/useAdminStatus";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to Africa/Lagos
dayjs.tz.setDefault("Africa/Lagos");

const ActiveAdminsCard = () => {
  const { data, isError } = useAdminStatus();

  const admins = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  return (
    <div className="card shadow border-0 p-3">
      <h6 className="fw-bold text-muted mb-3">Admin Activity Status</h6>
      {isError ? (
        <div className="text-center py-5 text-danger">
          Failed to load activity status.
        </div>
      ) : admins.length === 0 ? (
        <p className="text-muted">No admins found</p>
      ) : (
        <ul className="list-group list-group-flush">
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="list-group-item px-0 d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{admin.name}</strong>
                <div className="text-muted small">
                  Last Seen: &nbsp;
                  {admin.last_seen
                    ? dayjs.tz(admin.last_seen, "Africa/Lagos").fromNow()
                    : "Not Active"}
                </div>
              </div>
              <span
                className={`badge ${
                  admin.is_active
                    ? "bg-success-subtle text-success"
                    : "bg-danger-subtle text-danger"
                }`}
              >
                {admin.is_active ? "Active" : "Offline"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(ActiveAdminsCard);
