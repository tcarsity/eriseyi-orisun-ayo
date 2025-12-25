import React, { useEffect, useState } from "react";
import { useAdminActivities } from "../../hooks/useAdminActivities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdRecentActors } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useDeleteActivities } from "../../hooks/useDeleteActivities";

dayjs.extend(relativeTime);

const RecentActivityCard = () => {
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState([]);
  const { data, isLoading, isError } = useAdminActivities(page);
  const activities = data?.data || [];
  const safeActivities = Array.isArray(activities) ? activities : [];
  const meta = typeof data?.meta === "object" ? data.meta : null;

  useEffect(() => {
    if (!isLoading && activities.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [activities, isLoading, page]);

  const deletedActivities = useDeleteActivities();

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= meta?.last_page) {
      setPage(pageNumber);
    }
  };

  const toggleSelect = (id) => {
    setSelectedActivity((prev) =>
      prev.includes(id)
        ? prev.filter((ActivityId) => ActivityId !== id)
        : [...prev, id]
    );
  };

  const handleAllSelectAll = () => {
    if (selectedActivity.length === activities.length) {
      setSelectedActivity([]);
    } else {
      setSelectedActivity(activities.map((a) => a.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedActivity.length === 0) return alert("No activities selected");
    if (
      !window.confirm(`Delete ${selectedActivity.length} selected activities?`)
    )
      return;

    try {
      await deletedActivities.mutateAsync(selectedActivity);
      setSelectedActivity([]);
    } catch {
      alert("Failed to delete activities.");
    }
  };

  return (
    <>
      <div className="card shadow border-0 mb-4">
        <h4 className="fw-bold mb-0 ms-2">
          <MdRecentActors size={40} className="text-primary" /> Recent Admin
          Activity
        </h4>
        <div className="d-flex align-items-center ">
          {selectedActivity.length > 0 && (
            <>
              <button
                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                onClick={handleBulkDelete}
              >
                <FaTrash className="me-1" />
                Delete ({selectedActivity.length})
              </button>
              <button
                className="btn btn-outline-secondary btn-sm ms-2"
                onClick={() => setSelectedActivity([])}
              >
                Clear
              </button>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="d-flex flex-column align-items-center justify-content-center text-muted">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>
          </div>
        ) : isError ? (
          <p className="text-danger text-center py-5">
            Failed tol load activities.
          </p>
        ) : safeActivities.length === 0 ? (
          <p className="text-muted mb-0">No activity yet</p>
        ) : (
          <ul className="list-group list-group-flush">
            <li className="list-group-item bg-light fw-bold d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-3"
                  checked={
                    selectedActivity.length === safeActivities.length &&
                    safeActivities.length > 0
                  }
                  onChange={handleAllSelectAll}
                />
                <span>Select All</span>
              </div>
              <span>Total: {safeActivities.length}</span>
            </li>
            {safeActivities.map((a) => (
              <li
                key={a.id}
                className={`list-group-item d-flex justify-content-between align-items-start ${
                  selectedActivity.includes(a.id)
                    ? "bg-light border-primary"
                    : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center flex-grow-1">
                  <input
                    type="checkbox"
                    className="form-check-input me-3"
                    checked={selectedActivity.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                  />

                  <div>
                    <strong>{a.user_name || "Unknown"}</strong>
                    <div className="text-muted small">{a.details}</div>
                  </div>
                </div>
                <small className="text-muted">
                  {dayjs(a.created_at).fromNow()}
                </small>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && meta && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Prev
                  </button>
                </li>

                {(() => {
                  const windowSize = 3;
                  const startPage =
                    Math.floor((page - 1) / windowSize) * windowSize + 1;
                  const endPage = Math.min(
                    startPage + windowSize - 1,
                    meta.last_page
                  );

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <li
                        key={i}
                        className={`page-item ${page === i ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      </li>
                    );
                  }
                  return pages;
                })()}

                <li
                  className={`page-item ${
                    page === meta.last_page ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(RecentActivityCard);
