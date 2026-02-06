import React, { useRef, useState } from "react";
import Layout from "../common/Layout";
import { useForm } from "react-hook-form";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useCallback } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // lockout states
  const [attempts, setAttempts] = React.useState(
    Number(localStorage.getItem("login_attempts")) || 0
  );

  const [lockUntil, setLockUntil] = React.useState(
    Number(localStorage.getItem("login_lock_until")) || null
  );

  const [remainingTime, setRemainingTime] = React.useState(null);

  const intervalRef = useRef(null);

  // countdown timer useEffect
  React.useEffect(() => {
    if (!lockUntil) return;

    const updateRemaining = () => {
      const now = Date.now();
      const diff = lockUntil - now;

      if (diff <= 0) {
        // Unlock
        setLockUntil(null);
        setAttempts(0);
        setRemainingTime(null);

        localStorage.removeItem("login_attempts");
        localStorage.removeItem("login_lock_until");

        clearInterval(intervalRef.current);
      } else {
        setRemainingTime(Math.ceil(diff / 1000));
      }
    };

    updateRemaining();
    intervalRef.current = setInterval(updateRemaining, 1000);

    return () => clearInterval(intervalRef.current);
  }, [lockUntil]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/login", formData);
      return response.data;
    },
    retry: false,

    onSuccess: (data) => {
      // reset lock attempts on successful login
      setAttempts(0);
      localStorage.removeItem("login_attempts");
      localStorage.removeItem("login_lock_until");

      login(data.data, data.token);

      toast.success(data.message || "Login successful");

      if (data.data.role === "superadmin") {
        navigate("/superadmin-dashboard");
      } else if (data.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/unauthorized");
      }
    },
    onError: (error) => {
      if (error.isNetworkError || error.isTimeout) {
        toast.error(error.message);
        return;
      }
      // if backend locked 429 set UI lock
      const status = error.response?.status;
      if (status === 429) {
        // prefer a Retry After header if backend provides it
        const retryAfter =
          Number(error.response?.headers?.["retry-after"]) || 240; // fallback 4 mins

        const locktime = Date.now() + retryAfter * 1000;

        setLockUntil(locktime);
        localStorage.setItem("login_lock_until", locktime);

        toast.error(
          error.response?.data?.message ||
            "Too many attempts. Please try again later."
        );

        return;
      }

      // increment attempt
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("login_attempts", newAttempts);

      // 7 attempts -> lock for 4 mins
      if (newAttempts >= 7) {
        const lockTime = Date.now() + 4 * 60 * 1000;
        setLockUntil(lockTime);
        localStorage.setItem("login_lock_until", lockTime);

        toast.error("Too many attempts. Try again in 4 minutes.");
        return;
      }

      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  const onSubmit = useCallback(
    (formData) => {
      if (lockUntil) {
        toast.error("Login is locked. Please wait...");
        return;
      }
      mutation.mutate(formData);
    },
    [mutation, lockUntil]
  );
  return (
    <>
      <Layout>
        <section className="login py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12 col-md-8 col-lg-6 admin">
                <div className="card shadow border-0 p-4">
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <h5 className="mb-3 text-center">Login Form</h5>
                      <label className="form-label">Email</label>
                      <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <MdEmail />
                        </span>
                        <input
                          {...register("email", {
                            required: "The email field is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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

                      <div className="mt-4">
                        <label className="form-label">Password</label>

                        <div className="mb-3 input-group">
                          <span className="input-group-text">
                            <RiLockPasswordFill />
                          </span>

                          <input
                            {...register("password", {
                              required: "The password field is required",
                            })}
                            type={showPassword ? "text" : "password"}
                            className={`form-control form-control-sm ${
                              errors.password && "is-invalid"
                            }`}
                            placeholder="Enter your password"
                          />

                          <span
                            className="input-group-text"
                            role="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? (
                              <AiFillEyeInvisible />
                            ) : (
                              <AiFillEye />
                            )}
                          </span>

                          {errors.password && (
                            <p className="invalid-feedback d-block">
                              {errors.password?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        disabled={mutation.isPending || lockUntil}
                        type="submit"
                        className="btn btn-primary w-100 mt-4"
                      >
                        {lockUntil
                          ? `Locked (${remainingTime}s)`
                          : mutation.isPending
                          ? "Logging in..."
                          : "Login"}
                      </button>

                      <div className="d-flex justify-content-end mt-2 forgot">
                        <Link to="/forgot-password" className="pass">
                          Forgot Password
                        </Link>
                      </div>
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

export default React.memo(Login);
