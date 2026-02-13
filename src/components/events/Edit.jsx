import React, { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../common/Layout";
import SideBar from "../admincontrol/SideBar";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { resizeImage } from "../../utils/resizeImage";
import JoditEditor from "jodit-react";
import LoadingButton from "../LoadingButton";

const Edit = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 350,
      toolbarSticky: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
      ],
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      if (!id) return {};
      const res = await api.get(`/events/${id}`);
      const event = res.data.data;
      return {
        title: event.title,
        description: event.description,
        location: event.location,
        event_date: event.event_date,
        event_time: event.event_time,
        image: event.image,
      };
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const resized = await resizeImage(file, 600, 400);
    setSelectedImage(resized);
    setPreview(URL.createObjectURL(resized));
  };

  const { user } = useAuth();
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`);
      return res.data;
    },
  });

  const [preview, setPreview] = useState(data?.data.image || null);

  const mutation = useMutation({
    mutationFn: async (fd) => {
      return await api.post(`/events/${id}?_method=PUT`, fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("event updated successfully");
      navigate(`/${rolePrefix}-events`);
    },
    onError: (error) => {
      if (error.isNetworkError || error.isTimeout) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to update event");
    },
  });

  const onSubmit = useCallback(
    (data) => {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      fd.append("location", data.location);
      fd.append("event_date", data.event_date);
      fd.append("event_time", data.event_time);

      if (selectedImage) {
        fd.append("image", selectedImage);
      }
      mutation.mutate(fd);
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
                  <Link to="/superadmin-members">Event</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Update Event
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Update Event</h2>
                  <Link
                    to={`/${rolePrefix}-events`}
                    className="btn btn-primary btn-sm"
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
                      <p>failed to load event</p>
                    ) : (
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
                            <div className="mb-3">
                              <Controller
                                name="description"
                                control={control}
                                rules={{
                                  required: "The description field is required",
                                }}
                                render={({ field: { value, onChange } }) => (
                                  <JoditEditor
                                    ref={editor}
                                    value={value || ""}
                                    config={config}
                                    onChange={onChange}
                                  />
                                )}
                              />

                              {errors.description && (
                                <p className="text-danger small mt-1">
                                  {errors.description.message}
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

                            <LoadingButton
                              type="submit"
                              isLoading={mutation.isPending}
                              loadingText="Updating..."
                              className="btn-primary w-100 mt-3"
                            >
                              Update Event
                            </LoadingButton>
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

export default Edit;
