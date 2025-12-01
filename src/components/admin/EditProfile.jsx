import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideBar from "../admincontrol/SideBar";

const EditProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put("/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        setUser(data.data);
        queryClient.setQueryData(["admin"], data.data);
        toast.success(data.message || "Profile Updated Successfully");
      }
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Something went wrong updating profile"
      );
    },
  });

  const onSubmit = useCallback(
    (data) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <Layout>
      <section className="dashboard">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={`/${rolePrefix}-dashboard`}> Dashboard</Link>
              </li>
              <li className="breadcrumb-item active bread" aria-current="page">
                Update Profile
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Update Profile</h2>
                <Link
                  to={`/${rolePrefix}-dashboard`}
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
                <div className="col-md update-admin d-flex justify-content-center">
                  <div className="card shadow border-0 p-4">
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
                            placeholder="Enter your name"
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
                            className={`form-control form-control-sm ${
                              errors.email && "is-invalid"
                            }`}
                            placeholder="Enter your email"
                          />

                          {errors.email && (
                            <p className="invalid-feedback">
                              {errors.email?.message}
                            </p>
                          )}
                        </div>

                        <button
                          disabled={mutation.isPending}
                          type="submit"
                          className="btn btn-primary w-100 mt-4"
                        >
                          {mutation.isPending ? "Saving..." : "Update"}
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
  );
};

export default React.memo(EditProfile);
