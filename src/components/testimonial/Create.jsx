import React, { useCallback, useState } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";

import { FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import SideBar from "../admincontrol/SideBar";
import { resizeImage } from "../../utils/resizeImage";
import LoadingButton from "../LoadingButton";

const Create = () => {
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const resized = await resizeImage(file, 300, 300);
    setSelectedImage(resized);
    setPreview(URL.createObjectURL(resized));
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post("/testimonials", formData);
    },
    onSuccess: () => {
      toast.success("Testimonial added successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      reset();
    },
    onError: (error) => {
      if (error.isNetworkError || error.isTimeout) {
        toast.error(error.message);
        return;
      }

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      } else {
        toast.error("Failed to add testimonial");
      }
    },
  });

  const onSubmit = useCallback(
    (data) => {
      const formData = new FormData();
      formData.append("author", data.author);
      formData.append("designation", data.designation);
      formData.append("message", data.message);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      mutation.mutate(formData);
    },
    [mutation],
  );
  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/superadmin-members"> Testimonial</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Add Testimonial
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Add Testimonial</h2>
                  <Link
                    to={`/${rolePrefix}-testimonials`}
                    className="btn btn-primary"
                  >
                    Back
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>
              <div className="col-lg-9 board">
                <div className="row">
                  <div className="col-md">
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
                              accept="image/*"
                              type="file"
                              {...register("image")}
                              onChange={handleImageChange}
                              className={`form-control ${
                                errors.image && "is-invalid"
                              }`}
                            />
                            {errors.image && (
                              <p className="invalid-feedback">
                                {errors.image?.message}
                              </p>
                            )}
                          </div>

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

                          <LoadingButton
                            type="submit"
                            isLoading={mutation.isPending}
                            loadingText="Saving..."
                            className="btn-primary w-100 mt-3"
                          >
                            Create Testimonial
                          </LoadingButton>
                        </form>
                      </div>
                    </div>
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

export default React.memo(Create);
