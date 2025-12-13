import React, { useCallback, useMemo } from "react";
import Layout from "../common/Layout";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideBar from "../admincontrol/SideBar";

const Create = () => {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm();

  const seletedMonth = watch("birth_month");

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(0, i))
    );
  }, []);

  const days = useMemo(() => {
    if (!seletedMonth) return [];
    const monthIndex = months.indexOf(seletedMonth);
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [seletedMonth, months]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = { ...formData, phone: `${formData.phone}` };
      const { data } = await api.post("/members/admin", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      reset();
      toast.success("Member added successfully");
    },
    onError: (error) => {
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
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={`/${rolePrefix}-members`}> Members</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Add Member
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Add Member</h2>
                  <Link
                    to={`/${rolePrefix}-members`}
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

                          <label className="form-label">Phone</label>
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
                              className={`form-control ${
                                errors.phone && "is-invalid"
                              }`}
                              placeholder="Please enter your phone number"
                            />

                            {errors.phone && (
                              <p className="invalid-feedback">
                                {errors.phone?.message}
                              </p>
                            )}
                          </div>

                          <label className="form-label">Address</label>
                          <div className="mb-3 input-group">
                            <span className="input-group-text">
                              <FaLocationDot />
                            </span>
                            <input
                              {...register("address", {
                                required: "The address field is required",
                              })}
                              type="text"
                              className={`form-control ${
                                errors.address && "is-invalid"
                              }`}
                              placeholder="Please enter your address"
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
                            <label className="form-label"> Birth Date</label>
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
                            {mutation.isPending ? "Saving..." : "Create"}
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
    </>
  );
};

export default React.memo(Create);
