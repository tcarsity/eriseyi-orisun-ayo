import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Layout from "../common/Layout";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { supabase } from "../../lib/supabase";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: "https://eriseyi-orisun-ayo.vercel.app/reset-password",
      });
      if (error) throw error;
    },

    onSuccess: () => {
      toast.success("If the email exists, a reset link has been sent.");
      reset();
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  return (
    <Layout>
      <section className="forgotpassword py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-12 col-md-8 col-lg-6 pass">
              <div className="card border-0 shadow">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="mb-3 text-center">Forgot Password?</h5>

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
                        className={`form-control ${
                          errors.email && "is-invalid"
                        }`}
                        placeholder="Please enter your email"
                      />

                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email?.message}
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
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
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

export default React.memo(ForgotPassword);
