import React, { useCallback, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { RiLockPasswordFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import api from "../../api/axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // ✅ Check if user came from valid reset link
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setCheckingSession(false);
        }
      },
    );

    // fallback check
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast.error("Invalid or expired reset link.");

        navigate("/admin/login");
      } else {
        setCheckingSession(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
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
    },

    onSuccess: async () => {
      toast.success("Password reset successfully!");

      // Sign out temporary session

      await supabase.auth.signOut();
      if (!user?.email) {
        throw new Error("User session lost. Please try again.");
      }

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
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          errors.password && "is-invalid"
                        }`}
                        placeholder="Please enter your new password"
                      />

                      <span
                        className="input-group-text"
                        role="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </span>

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
                        type={showPasswordConfirm ? "text" : "password"}
                        className={`form-control ${
                          errors.password_confirmation && "is-invalid"
                        }`}
                        placeholder="Please confirm password"
                      />

                      <span
                        className="input-group-text"
                        role="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPasswordConfirm((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPasswordConfirm ? (
                          <AiFillEyeInvisible />
                        ) : (
                          <AiFillEye />
                        )}
                      </span>

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
