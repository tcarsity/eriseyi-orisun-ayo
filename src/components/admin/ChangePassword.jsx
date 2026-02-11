import React, { useCallback } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import SideBar from "../admincontrol/SideBar";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../context/AuthContext";
import { RiLockPasswordFill } from "react-icons/ri";
import LoadingButton from "../LoadingButton";

const ChangePassword = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  if (!user) return null;

  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.post("/change-password", data);
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      reset();
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      } else {
        toast.error("Failed to change password");
      }
    },
  });
  const onSubmit = useCallback(
    (data) => {
      mutation.mutate(data);
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
                  <Link to="/superadmin-members"> Change Password</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Change Password
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Change Password</h2>
                  <Link
                    to={`/${rolePrefix}-dashboard`}
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
                  <div className="col-md update-admin d-flex justify-content-center">
                    <div className="card shadow border-0 p-4">
                      <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="mt-4">
                            <label className="form-label">
                              Current Password
                            </label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text">
                                <RiLockPasswordFill />
                              </span>
                              <input
                                {...register("current_password", {
                                  required:
                                    "The current password field is required",
                                })}
                                type="password"
                                className={`form-control ${
                                  errors.current_password && "is-invalid"
                                }`}
                                placeholder="Enter your current password"
                              />

                              {errors.current_password && (
                                <p className="invalid-feedback">
                                  {errors.current_password?.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="form-label">New Password</label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text">
                                <RiLockPasswordFill />
                              </span>
                              <input
                                {...register("new_password", {
                                  required:
                                    "The new password field is required",
                                })}
                                type="password"
                                className={`form-control ${
                                  errors.new_password && "is-invalid"
                                }`}
                                placeholder=" Enter your new password"
                              />

                              {errors.new_password && (
                                <p className="invalid-feedback">
                                  {errors.new_password?.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="form-label">
                              Confirm New Password
                            </label>
                            <div className="mb-3 input-group">
                              <span className="input-group-text">
                                <RiLockPasswordFill />
                              </span>
                              <input
                                {...register("new_password_confirmation", {
                                  required:
                                    "Please confirm new password field is required",
                                })}
                                type="password"
                                className={`form-control ${
                                  errors.new_password_confirmation &&
                                  "is-invalid"
                                }`}
                                placeholder="Confirm your new password"
                              />

                              {errors.new_password_confirmation && (
                                <p className="invalid-feedback">
                                  {errors.new_password_confirmation?.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <LoadingButton
                            type="submit"
                            isLoading={mutation.isPending}
                            loadingText="Updating...."
                            className="btn-primary w-100 mt-4"
                          >
                            Update Password
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

export default React.memo(ChangePassword);
