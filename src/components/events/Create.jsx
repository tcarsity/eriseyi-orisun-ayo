import React, { useCallback, useState } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import SideBar from "../admincontrol/SideBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { resizeImage } from "../../utils/resizeImage";

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

    const resized = await resizeImage(file, 600, 400);
    setSelectedImage(resized);
    setPreview(URL.createObjectURL(resized));
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post("/events", formData);
    },
    onSuccess: () => {
      toast.success("Event added successfully");
      queryClient.invalidateQueries(["events"]);
      reset();
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      } else {
        toast.error("Failed to add event");
      }
    },
  });

  const onSubmit = useCallback(
    (data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("event_date", data.event_date);
      formData.append("event_time", data.event_time);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      mutation.mutate(formData);
    },
    [mutation]
  );
  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/superadmin-members">Event</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Add Event
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Add Event</h2>
                  <Link
                    to={`/${rolePrefix}-events`}
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
                          <label className="form-label">Title</label>
                          <div className="mb-3 input-group">
                            <span className="input-group-text"></span>
                            <input
                              {...register("title", {
                                required: "The title field is required",
                              })}
                              type="text"
                              className={`form-control ${
                                errors.title && "is-invalid"
                              }`}
                              placeholder="Title"
                            />

                            {errors.title && (
                              <p className="invalid-feedback">
                                {errors.title?.message}
                              </p>
                            )}
                          </div>

                          <label className="form-label">Location</label>
                          <div className="mb-3 input-group">
                            <span className="input-group-text"></span>
                            <input
                              {...register("location", {
                                required: "The location field is required",
                              })}
                              type="text"
                              className={`form-control ${
                                errors.location && "is-invalid"
                              }`}
                              placeholder="location"
                            />

                            {errors.location && (
                              <p className="invalid-feedback">
                                {errors.location?.message}
                              </p>
                            )}
                          </div>

                          <label className="form-label">Description</label>
                          <div className="mb-3 input-group">
                            <textarea
                              {...register("description", {
                                required: "The description field is required",
                              })}
                              className={`form-control ${
                                errors.description && "is-invalid"
                              }`}
                              placeholder="Description"
                              rows={4}
                            ></textarea>

                            {errors.description && (
                              <p className="invalid-feedback">
                                {errors.description?.message}
                              </p>
                            )}
                          </div>

                          <label className="form-label">Event Date</label>
                          <div className="mb-3 input-group">
                            <span className="input-group-text"></span>
                            <input
                              {...register("event_date", {
                                required: "The event date field is required",
                              })}
                              type="date"
                              className={`form-control ${
                                errors.event_date && "is-invalid"
                              }`}
                              placeholder="Event Date"
                            />

                            {errors.event_date && (
                              <p className="invalid-feedback">
                                {errors.event_date?.message}
                              </p>
                            )}
                          </div>

                          <label className="form-label">Event Time</label>
                          <div className="mb-3 input-group">
                            <span className="input-group-text"></span>
                            <input
                              {...register("event_time", {
                                required: "The event_time field is required",
                              })}
                              type="time"
                              className={`form-control ${
                                errors.event_time && "is-invalid"
                              }`}
                              placeholder="Event Time"
                            />

                            {errors.event_time && (
                              <p className="invalid-feedback">
                                {errors.event_time?.message}
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

                          <button
                            type="submit"
                            className="btn btn-primary w-100 mt-3"
                            disabled={mutation.isPending}
                          >
                            {mutation.isPending ? "Saving..." : "Add Event"}
                          </button>
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

export default Create;
