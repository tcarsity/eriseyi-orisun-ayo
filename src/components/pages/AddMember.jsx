import React, { useCallback, useEffect, useMemo } from "react";
import Layout from "../common/Layout";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

const AddMember = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm();
  const seletedMonth = watch("birth_month");

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(0, i))
    );
  }, []);

  const days = useMemo(() => {
    if (!seletedMonth) return [];

    const monthIndex = months.indexOf(seletedMonth) + 1;

    // Always allow Feb 29
    if (monthIndex === 2) {
      return Array.from({ length: 29 }, (_, i) => i + 1);
    }

    const daysInMonth = new Date(2024, monthIndex, 0).getDate(); // 2024 = leap-safe
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [seletedMonth, months]);

  useEffect(() => {
    const selectedDay = watch("birth_date");

    if (selectedDay && days.length && selectedDay > days.length) {
      // reset only the birth_date field
      reset({ birth_date: "" }, { keepValues: true });
    }
  }, [days, watch, reset]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = { ...formData, phone: `${formData.phone}` };
      const { data } = await api.post("/members/public", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      reset();
      toast.success("Member added successfully");
    },
    onError: (error) => {
      if (error.isNetworkError) {
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
    [mutation]
  );
  return (
    <>
      <Layout>
        <section className="section-6 py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12 col-md-8 col-lg-6">
                <div className="card shadow border-0 ">
                  <div className="card-body p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <label className="form-label">Full Name</label>
                      <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <input
                          {...register("name", {
                            required: "The full name field is required",
                          })}
                          type="text"
                          className={`form-control form-control-sm ${
                            errors.name && "is-invalid"
                          }`}
                          placeholder="Enter your full name"
                        />

                        {errors.name && (
                          <p className="invalid-feedback">
                            {errors.name?.message}
                          </p>
                        )}
                      </div>

                      <label className="form-label">Phone No.</label>
                      <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <FaPhone /> &nbsp; +234
                        </span>
                        <input
                          {...register("phone", {
                            required: "The phone field is required",
                            pattern: {
                              value: /^(70|71|80|81|90|91)\d{8}$/,
                              message: "Enter a valid 10 digits after +234",
                            },
                          })}
                          type="number"
                          className={`form-control form-control-sm ${
                            errors.phone && "is-invalid"
                          }`}
                          placeholder="Enter your phone number"
                        />

                        {errors.phone && (
                          <p className="invalid-feedback">
                            {errors.phone?.message}
                          </p>
                        )}
                      </div>

                      <label className="form-label">Home Address</label>
                      <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <FaLocationDot />
                        </span>
                        <input
                          {...register("address", {
                            required: "The home address field is required",
                          })}
                          type="text"
                          className={`form-control form-control-sm ${
                            errors.address && "is-invalid"
                          }`}
                          placeholder="Enter your home address"
                        />

                        {errors.address && (
                          <p className="invalid-feedback">
                            {errors.address?.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                          {...register("gender", {
                            required: "The gender field is required",
                          })}
                          className={`form-select form-select-sm ${
                            errors.gender && "is-invalid"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>

                        {errors.gender && (
                          <p className="invalid-feedback">
                            {errors.gender?.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Birth Month</label>
                        <select
                          {...register("birth_month", {
                            required: "The month field is required",
                          })}
                          className={`form-select form-select-sm ${
                            errors.birth_month && "is-invalid"
                          }`}
                        >
                          <option value="">Select month</option>
                          {months.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        {errors.birth_month && (
                          <p className="invalid-feedback">
                            {errors.birth_month?.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Birth Date</label>
                        <select
                          {...register("birth_date", {
                            required: "The date field is required",
                          })}
                          className={`form-select form-select-sm ${
                            errors.birth_date && "is-invalid"
                          }`}
                        >
                          <option value="">Select date</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        {errors.birth_date && (
                          <p className="invalid-feedback">
                            {errors.birth_date?.message}
                          </p>
                        )}
                      </div>

                      <button
                        disabled={mutation.isPending}
                        className="btn btn-primary w-100 mt-3"
                      >
                        {mutation.isPending ? "Saving..." : "Submit"}
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

export default React.memo(AddMember);
