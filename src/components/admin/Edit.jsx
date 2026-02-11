import React, { useCallback } from "react";
import Layout from "../common/Layout";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios";
import SideBar from "../admincontrol/SideBar";
import { useAuth } from "../context/AuthContext";
import LoadingButton from "../LoadingButton";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: async () => {
      if (!id) return {};
      const res = await api.get(`/users/${id}`);
      const user = res.data.data;
      return {
        name: user.name,
        email: user.email,
      };
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await api.put(`/users/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("Admin updated successfully");
      navigate(`/superadmin-admins`);
    },
    onError: (error) => {
      if (error.isNetworkError || error.isTimeout) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to update admin");
    },
  });

  const onSubmit = useCallback(
    (data) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  if (error) return <p>Error loading admin</p>;

  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/superadmin-dashboard">Super Admin</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Update Admin
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Update Admin</h2>
                </div>
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>

              <div className="col-lg-9 board">
                <div className="row">
                  <div className="col-md update-admin d-flex justify-content-center">
                    {isLoading ? (
                      <div className="d-flex justify-content-center my-3">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <p>failed to load form</p>
                    ) : (
                      <div className="card shadow border-0 p-4 ">
                        <div className="card-body">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <label className="form-label">Name</label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text">
                                <FaUser />
                              </span>
                              <input
                                {...register("name", {
                                  required: "The name field is required",
                                })}
                                type="text"
                                className={`form-control ${
                                  errors.name && "is-invalid"
                                }`}
                                placeholder="Name"
                              />

                              {errors.name && (
                                <p className="invalid-feedback">
                                  {errors.name?.message}
                                </p>
                              )}
                            </div>

                            <label className="form-label">Email</label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text">
                                <MdEmail />
                              </span>
                              <input
                                {...register("email", {
                                  required: "The email field is required",
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                  },
                                })}
                                type="text"
                                className={`form-control ${
                                  errors.email && "is-invalid"
                                }`}
                                placeholder="Email"
                              />

                              {errors.email && (
                                <p className="invalid-feedback">
                                  {errors.email?.message}
                                </p>
                              )}
                            </div>

                            <LoadingButton
                              type="submit"
                              isLoading={mutation.isPending}
                              loadingText="Updating..."
                              className="btn-primary w-100 mt-3"
                            >
                              Update
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

export default React.memo(Edit);
