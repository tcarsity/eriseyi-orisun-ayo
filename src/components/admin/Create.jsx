import React, { useCallback } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";
import SideBar from "../admincontrol/SideBar";
import LoadingButton from "../LoadingButton";

const Create = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post("/users", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      reset();
      toast.success("Admin added successfully");
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
        toast.error(error.response?.data?.message || "Something went wrong");
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
                  <Link to="/superadmin-members">Admins</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Add Admin
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Add Admin</h2>
                  <Link to="/superadmin-admins" className="btn btn-primary">
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
                              placeholder="Please enter your name"
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
                            loadingText="Saving..."
                            className="btn-primary w-100 mt-3"
                          >
                            Create Admin
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
