import React, { useEffect, useState } from "react";
import { useSecurityLogs } from "../../hooks/useSecurityLogs";
import {
  FaKey,
  FaLock,
  FaSignInAlt,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useDeleteSecurityLogs } from "../../hooks/useDeleteSecurityLogs";

dayjs.extend(relativeTime);

const SecurityLogCard = () => {
  const [page, setPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState([]);

  const deleteLogs = useDeleteSecurityLogs();
  const { data, isError } = useSecurityLogs(page);
  const logs = data?.data || [];
  const safeLogs = Array.isArray(logs) ? logs : [];
  const meta = typeof data?.meta === "object" ? data.meta : null;

  useEffect(() => {
    if (safeLogs.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
      setSelectedLogs([]);
    }
  }, [safeLogs, page]);

  const handlePageChange = (pageNumber) => {
    if (!meta) return;
    if (pageNumber >= 1 && pageNumber <= meta?.last_page) {
      setPage(pageNumber);
      setSelectedLogs([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]
    );
  };

  const handleAllSelectAll = () => {
    if (selectedLogs.length === safeLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(safeLogs.map((log) => log.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLogs.length === 0) return alert("No logs selected");
    if (!window.confirm(`Delete ${selectedLogs.length} selected logs?`)) return;

    try {
      await deleteLogs.mutateAsync(selectedLogs);

      setSelectedLogs([]);
    } catch {
      alert("Failed to delete logs.");
    }
  };

  const iconMap = {
    "User logged in": <FaSignInAlt className="text-success" />,
    "User logged out": <FaSignOutAlt className="text-danger" />,
    "Password reset link requested": <FaKey className="text-warning" />,
    "Password reset successfully": <FaLock className="text-info" />,
    "Failed login attempt": <FaLock className="text-danger" />,
  };

  return (
    <div className="card shadow border-0 mb-4 h-100">
      <div className="card-header bg-white d-flex justify-content-between gap-3 align-items-center">
        <h5 className="mb-0">Security Logs</h5>
        <div className="d-flex align-items-center ">
          {selectedLogs.length > 0 && (
            <>
              <button
                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                onClick={handleBulkDelete}
              >
                <FaTrash className="me-1" />
                Delete ({selectedLogs.length})
              </button>
              <button
                className="btn btn-outline-secondary btn-sm ms-2"
                onClick={() => setSelectedLogs([])}
              >
                Clear
              </button>
            </>
          )}
          <small className="text-muted ms-2">Recent log activity</small>
        </div>
      </div>

      <div className="card-body p-0">
        {isError ? (
          <div className="text-center py-5 text-danger">
            Failed to load security logs.
          </div>
        ) : safeLogs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No security logs available.
          </div>
        ) : (
          <>
            <ul className="list-group list-group-flush">
              {/* select all checkbox*/}
              <li className="list-group-item bg-light fw-bold d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-3"
                    checked={
                      selectedLogs.length === safeLogs.length &&
                      safeLogs.length > 0
                    }
                    onChange={handleAllSelectAll}
                  />
                  <span>Select All</span>
                </div>
                <span>Total: {safeLogs.length}</span>
              </li>
              {safeLogs.map((log) => (
                <li
                  key={log.id}
                  className={`list-group-item d-flex justify-content-between align-items-start ${
                    selectedLogs.includes(log.id)
                      ? "bg-light border-primary"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => toggleSelect(log.id)}
                    />

                    <span className="me-3 fs-3">
                      {iconMap[log.action] || <FaLock />}
                    </span>
                    <div>
                      <strong>{log.action}</strong>
                      <div className="small text-muted">
                        {log.user_name || "Unknown"}
                        &nbsp;
                        {dayjs(log.created_at).fromNow()}
                      </div>
                    </div>
                  </div>
                  <span className="text-muted small">
                    {log.ip_address || "N/A"}
                  </span>
                </li>
              ))}
            </ul>

            {/* Pagination controls */}
            {meta && meta.last_page > 1 && (
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
                            className={`page-item ${
                              page === i ? "active" : ""
                            }`}
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
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(SecurityLogCard);
