import React, { useCallback } from "react";
import Layout from "../common/Layout";
import { RiLockPasswordFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const email = params.get("email");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { email },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.post("/reset-password", data);
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "Password Reset Successfully");
      navigate("/admin/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = useCallback(
    (data) => {
      mutation.mutate({ ...data, token, email });
    },
    [mutation]
  );
  const password = watch("password");

  return (
    <>
      <Layout>
        <section className="reset-password py-5">
          <div className="container py-5">
            <div className="row">
              <div className="col-md-4 pass">
                <div className="card border-0 shadow">
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <h5 className="mb-3">Reset Password</h5>

                      <label className="form-label">New Password</label>
                      <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <RiLockPasswordFill />
                        </span>
                        <input
                          {...register("password", {
                            required: "The password field is required",
                            minLength: {
                              value: 8,
                              message: "Minimum 8 character",
                            },
                          })}
                          type="password"
                          className={`form-control ${
                            errors.password && "is-invalid"
                          }`}
                          placeholder="Please enter your new password"
                        />

                        {errors.password && (
                          <p className="invalid-feedback">
                            {errors.password?.message}
                          </p>
                        )}
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
                            {...register("password_confirmation", {
                              required: "Please confirm password",
                              validate: (val) =>
                                val === password || "Password do not match",
                            })}
                            type="password"
                            className={`form-control ${
                              errors.password_confirmation && "is-invalid"
                            }`}
                            placeholder="Please confirm password"
                          />

                          {errors.password_confirmation && (
                            <p className="invalid-feedback">
                              {errors.password_confirmation?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </form>
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

export default React.memo(ResetPassword);
