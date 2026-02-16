import React, { useCallback, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { RiLockPasswordFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import api from "../../api/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // ✅ Check if user came from valid reset link

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        toast.error("Invalid or expired reset link.");
        navigate("/admin/login");
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // 1️⃣ Update password in Supabase

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      // 2️⃣ Get authenticated user email from Supabase

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 3️⃣ Sync password to your own backend DB

      await api.post("/update-admin-password", {
        email: user.email,

        password: data.password,
      });
    },

    onSuccess: async () => {
      toast.success("Password reset successfully!");

      // Sign out temporary session

      await supabase.auth.signOut();

      navigate("/admin/login");
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = useCallback(
    (data) => {
      mutation.mutate(data);
    },

    [mutation],
  );

  if (checkingSession) {
    return null; // prevent flashing UI before session check
  }

  return (
    <Layout>
      <section className="reset-password py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-12 col-md-8 col-lg-6 pass">
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

                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                            message:
                              "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
                          },
                        })}
                        type="password"
                        className={`form-control ${
                          errors.password && "is-invalid"
                        }`}
                        placeholder="Please enter your new password"
                      />

                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>

                    <label className="form-label">Confirm New Password</label>

                    <div className="mb-3 input-group">
                      <span className="input-group-text">
                        <RiLockPasswordFill />
                      </span>

                      <input
                        {...register("password_confirmation", {
                          required: "Please confirm password",

                          validate: (val) =>
                            val === password || "Passwords do not match",
                        })}
                        type="password"
                        className={`form-control ${
                          errors.password_confirmation && "is-invalid"
                        }`}
                        placeholder="Please confirm password"
                      />

                      {errors.password_confirmation && (
                        <div className="invalid-feedback">
                          {errors.password_confirmation.message}
                        </div>
                      )}
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
  );
};

export default React.memo(ResetPassword);
