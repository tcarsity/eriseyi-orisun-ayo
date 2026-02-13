import React, { useState } from "react";
import { Link } from "react-router-dom";
import SideBar from "../admincontrol/SideBar";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import Layout from "../common/Layout";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import TableRowSkeleton from "../ui/TableRowSkeleton";

const Show = () => {
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const { user } = useAuth();
  if (!user) return null;
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);

      setDeletingId(null);
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete event";
      toast.error(message);
      setDeletingId(null);
    },
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data;
    },
  });

  const events = data?.data ?? [];

  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={`/${rolePrefix}-events`}> Events</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Events
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Events</h2>
                  <Link
                    to={`/${rolePrefix}-event/create`}
                    className="btn btn-primary btn-sm"
                  >
                    + Add Event
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>

              <div className="col-lg-9 board">
                <div className="row">
                  <div className="col-md-12">
                    {error ? (
                      <p>failed to load events</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover table-sm align-middle">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Location</th>
                              <th>Date & Time</th>
                              <th>Image</th>
                              <th className="d-none d-md-table-cell">
                                Creator
                              </th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading || isFetching ? (
                              <TableRowSkeleton rows={6} columns={11} />
                            ) : events.length > 0 ? (
                              events.map((event, index) => (
                                <tr key={event.id}>
                                  <td>{index + 1}</td>
                                  <td>{event.title}</td>
                                  <td style={{ maxWidth: "200px" }}>
                                    <div
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {stripHtml(event.description).slice(
                                        0,
                                        60,
                                      )}
                                      ...
                                    </div>
                                  </td>
                                  <td style={{ minWidth: "140px" }}>
                                    {event.location}
                                  </td>
                                  <td>
                                    {new Date(
                                      event.event_date,
                                    ).toLocaleDateString()}

                                    <br />

                                    <small className="text-muted">
                                      {event.event_time}
                                    </small>
                                  </td>
                                  <td>
                                    {event.image ? (
                                      <img
                                        src={event.image}
                                        alt={event.title}
                                        style={{
                                          width: "60px",
                                          height: "60px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                        }}
                                      />
                                    ) : (
                                      "No Image"
                                    )}
                                  </td>
                                  <td className="d-none d-md-table-cell">
                                    <span className="badge bg-light text-dark">
                                      {event.creator?.name || "Superadmin"}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/${rolePrefix}-event/edit/${event.id}`}
                                      className="btn btn-light btn-icon btn-sm"
                                    >
                                      <FaEdit />
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-icon btn-sm"
                                      disabled={deletingId === event.id}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Are you sure you want to delete this event?",
                                          )
                                        ) {
                                          setDeletingId(event.id);
                                          deleteMutation.mutate(event.id);
                                        }
                                      }}
                                    >
                                      <MdDelete />
                                      {deletingId === event.id
                                        ? "Deleting..."
                                        : "Delete"}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="11" className="text-center">
                                  No events yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default React.memo(Show);
