import React, { useState } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import SideBar from "../admincontrol/SideBar";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const Show = () => {
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const { user } = useAuth();
  if (!user) return null;
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/testimonials/${id}`),

    onMutate: async (id) => {
      await queryClient.cancelQueries(["testimonials"]);

      const previousTestimonials = queryClient.getQueryData(["testimonials"]);

      // 🔥 remove instantly from UI
      queryClient.setQueryData(["testimonials"], (old) =>
        old?.filter((t) => t.id !== id)
      );

      return { previousTestimonials };
    },

    onSuccess: () => {
      toast.success("Testimonial deleted successfully");
    },

    onError: (error, id, context) => {
      // rollback if delete fails
      queryClient.setQueryData(["testimonials"], context.previousTestimonials);

      toast.error("Failed to delete testimonial");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["testimonials"]);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await api.get("/testimonials");
      return res.data;
    },
  });

  const testimonials = data?.data ?? [];
  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={`/${rolePrefix}-testimonials`}> Testimonials</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Testimonials
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Testimonials</h2>
                  <Link
                    to={`/${rolePrefix}-testimonail/create`}
                    className="btn btn-primary"
                  >
                    + Add Testimonial
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>

              <div className="col-lg-9 board">
                <div className="row ">
                  <div className="col-md-12">
                    {isLoading ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <p>failed to load testimonial</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Author</th>
                              <th>Designation</th>
                              <th>Message</th>
                              <th>Image</th>
                              <th>Created_at</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testimonials.length > 0 ? (
                              testimonials.map((testimonial, index) => (
                                <tr key={testimonial.id}>
                                  <td>{index + 1}</td>
                                  <td>{testimonial.author}</td>
                                  <td>{testimonial.designation}</td>
                                  <td>{testimonial.message}</td>
                                  <td>
                                    {testimonial.image ? (
                                      <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
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
                                  <td>{testimonial.created_at}</td>
                                  <td>
                                    <Link
                                      to={`/${rolePrefix}-testimonial/edit/${testimonial.id}`}
                                      className="btn btn-light btn-icon"
                                    >
                                      <FaEdit className="me-2" />
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-icon"
                                      onClick={() => {
                                        if (window.confirm("Are you sure?")) {
                                          deleteMutation.mutate(testimonial.id);
                                        }
                                      }}
                                    >
                                      <MdDelete className="me-2" />
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No testimonails yet
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

export default Show;
