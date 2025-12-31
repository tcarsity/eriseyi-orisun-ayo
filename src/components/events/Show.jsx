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

const Show = () => {
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data;
    },
  });

  const events = Array.isArray(data) ? data : data?.data ?? [];

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
                    {isLoading ? (
                      <div className="d-flex justify-content-center align-items-center py-5">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <p>failed to load events</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Location</th>
                              <th>Event Date</th>
                              <th>Event Time</th>
                              <th>Image</th>
                              <th>Creator</th>
                              <th>Created_at</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {events.length > 0 ? (
                              events.map((event, index) => (
                                <tr key={event.id}>
                                  <td>{index + 1}</td>
                                  <td>{event.title}</td>
                                  <td>{event.description}</td>
                                  <td>{event.location}</td>
                                  <td>
                                    {new Date(
                                      event.event_date
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>{event.event_time}</td>
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
                                  <td>
                                    <span className="badge bg-light text-dark">
                                      {event.creator?.name || "Superadmin"}
                                    </span>
                                  </td>
                                  <td>{event.created_at}</td>
                                  <td>
                                    <Link
                                      to={`/${rolePrefix}-event/edit/${event.id}`}
                                      className="btn btn-light btn-icon"
                                    >
                                      <FaEdit className="me-2" />
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-icon"
                                      disabled={deletingId === event.id}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Are you sure you want to delete this event?"
                                          )
                                        ) {
                                          setDeletingId(event.id);
                                          deleteMutation.mutate(event.id);
                                        }
                                      }}
                                    >
                                      <MdDelete className="me-2" />
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
