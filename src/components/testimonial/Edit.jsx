import React, { useCallback, useState } from "react";
import Layout from "../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";

import { FaEnvelope, FaUser } from "react-icons/fa";
import api from "../../api/axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SideBar from "../admincontrol/SideBar";
import { useAuth } from "../context/AuthContext";

const Edit = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: async () => {
      if (!id) return {};
      const res = await api.get(`/testimonials/${id}`);
      const testimonial = res.data.data;
      return {
        author: testimonial.author,
        message: testimonial.message,
        designation: testimonial.designation,
        image: testimonial.image,
      };
    },
  });

  const { user } = useAuth();
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const {
    data: testimonial,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["testimonial", id],
    queryFn: async () => {
      const res = await api.get(`/testimonials/${id}`);
      return res.data;
    },
  });

  const [preview, setPreview] = useState(testimonial?.data.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (fd) => {
      return await api.post(`/testimonials/${id}?_method=PUT`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
      toast.success("Testimonial updated successfully");
      navigate(`/${rolePrefix}-testimonials`);
    },
    onError: () => {
      toast.error("Failed to update testimonial");
    },
  });

  const onSubmit = useCallback(
    (data) => {
      const fd = new FormData();
      fd.append("author", data.author);
      fd.append("designation", data.designation);
      fd.append("message", data.message);

      if (data.image && data.image[0]) {
        fd.append("image", data.image[0]);
      }
      updateMutation.mutate(fd);
    },
    [updateMutation]
  );

  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={`/${rolePrefix}-dashboard`}>{user?.role}</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Update Testimonial
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Update Testimonial</h2>
                </div>
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>
              <div className="col-lg-9 board">
                <div className="row">
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
                    ) : isError ? (
                      <p>failed to load testimonial</p>
                    ) : (
                      <div className="card shadow border-0 p-4">
                        <div className="card-body">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <label className="form-label">Author</label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text">
                                <FaUser />
                              </span>
                              <input
                                {...register("author", {
                                  required: "The author field is required",
                                })}
                                type="text"
                                className={`form-control ${
                                  errors.author && "is-invalid"
                                }`}
                                placeholder="Author"
                              />

                              {errors.author && (
                                <p className="invalid-feedback">
                                  {errors.author?.message}
                                </p>
                              )}
                            </div>

                            <label className="form-label">Designation</label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text"></span>
                              <input
                                {...register("designation", {
                                  required: "The designation field is required",
                                })}
                                type="text"
                                className={`form-control ${
                                  errors.designation && "is-invalid"
                                }`}
                                placeholder="Designation"
                              />

                              {errors.designation && (
                                <p className="invalid-feedback">
                                  {errors.designation?.message}
                                </p>
                              )}
                            </div>

                            <label className="form-label">Message</label>
                            <div className="mb-3 input-group">
                              <textarea
                                {...register("message", {
                                  required: "The message field is required",
                                })}
                                className={`form-control ${
                                  errors.testimonial && "is-invalid"
                                }`}
                                placeholder="Message"
                                rows={4}
                              ></textarea>

                              {errors.message && (
                                <p className="invalid-feedback">
                                  {errors.message?.message}
                                </p>
                              )}
                            </div>

                            <label className="form-label">Upload Image</label>
                            <div className="mb-3 input-group">
                              <input
                                {...register("image")}
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={handleImageChange}
                              />
                            </div>
                            <small className="text-muted">
                              Leave empty if you don't want to change the image
                            </small>

                            {preview && (
                              <div style={{ marginTop: "10px" }}>
                                <img
                                  src={preview}
                                  alt="Preview"
                                  width="120"
                                  style={{ borderRadius: "8px" }}
                                />
                              </div>
                            )}

                            <button
                              type="submit"
                              className="btn btn-primary w-100 mt-4"
                            >
                              {updateMutation.isPending
                                ? "Updating..."
                                : "Update"}
                            </button>
                          </form>
                        </div>
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

export default React.memo(Edit);
