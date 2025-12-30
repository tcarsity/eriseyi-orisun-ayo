import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../common/Layout";
import { useAuth } from "../context/AuthContext";
import SideBar from "./SideBar";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useInView } from "react-intersection-observer";
import useEvents from "../../hooks/useEvents";
import { useNewMembers } from "../../hooks/useNewMembers";
import dayjs from "dayjs";
import { useTheme } from "../context/ThemeContext";
import { useHeartbeat } from "../../hooks/useHeartbeat";
import DashboardPreloader from "../DashboardPreloader";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

const AdminPerformanceCard = lazy(() =>
  import("../admin/AdminPerformanceCard")
);
const DashboardEventsCard = lazy(() => import("../admin/DashboardEventsCard"));
const MembersStatsCard = lazy(() => import("../admin/MembersStatsCard"));

const AdminDashboard = () => {
  useHeartbeat();
  const queryClient = useQueryClient();
  const { user, greeting, token } = useAuth(); // from AuthContext
  const [dashboardReady, setDashboardReady] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user || !token) return;

    const TOTAL_TASKS = 4; // adjust if you add/remove APIs
    let completed = 0;

    const updateProgress = () => {
      completed += 1;
      setProgress(Math.round((completed / TOTAL_TASKS) * 100));
    };

    const prepareDashboard = async () => {
      try {
        await queryClient.prefetchQuery({
          queryKey: ["dashboardStats"],
          queryFn: async () => {
            const { data } = await api.get("/dashboard-stats");
            updateProgress();
            return data;
          },
          enabled,
          staleTime: 5 * 60 * 1000,
        });

        if (token) {
          await queryClient.prefetchQuery({
            queryKey: ["recent-members"],
            queryFn: async () => {
              const res = await api.get("/recent-public-members");
              updateProgress();
              return res.data?.data ?? [];
            },
            enabled,
            staleTime: 5 * 60 * 1000,
          });
        }

        await queryClient.prefetchQuery({
          queryKey: ["events"],
          queryFn: async () => {
            const { data } = await api.get("/events");
            updateProgress();
            return data.data;
          },
          enabled,
          staleTime: 5 * 60 * 1000,
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminPerformance"],
          queryFn: async () => {
            const res = await api.get("/admin/activities/performance");
            updateProgress();
            return res.data.data || [];
          },
          enabled,
          staleTime: 5 * 60 * 1000,
        });
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setDashboardReady(true);
      }
    };

    prepareDashboard();
  }, [user, token, queryClient]);

  if (!token || !user) return null;

  if (!dashboardReady) {
    return <DashboardPreloader progress={progress} />;
  }

  const { events } = useEvents({
    enabled: dashboardReady && !!token,
  });

  const { data } = useDashboardStats({
    enabled: dashboardReady && !!token,
  });

  const { data: newMembers = [] } = useNewMembers({
    enabled: dashboardReady && !!token,
  });

  const today = dayjs().format("DD-MM-YYYY");

  const newMembersToday = useMemo(() => {
    if (!Array.isArray(newMembers)) return [];

    return newMembers.filter((m) => {
      const joinedDate = dayjs(m.created_at).format("DD-MM-YYYY");
      return joinedDate === today;
    });
  }, [newMembers, today]);

  const newMembersCount = newMembersToday.length;

  const rolePrefix = useMemo(
    () => (user?.role === "superadmin" ? "superadmin" : "admin"),
    [user?.role]
  );

  const inViewConfig = { triggerOnce: true, threshold: 0.2 };
  const [memberRef, memberInView] = useInView(inViewConfig);

  const [eventRef, eventInView] = useInView(inViewConfig);

  const [performanceRef, performanceInView] = useInView(inViewConfig);

  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link
                    to={`/${rolePrefix}-dashboard`}
                    className="text-decoration-none"
                  >
                    {greeting}
                  </Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  You are logged in as <strong>{user?.role}</strong>
                </li>
              </ol>
            </nav>

            {newMembersCount > 0 && (
              <div className="alert alert-success d-flex justify-content-between align-items-center shadow mb-4">
                <div>
                  <strong>🎉 {newMembersCount} </strong>
                  {newMembersCount === 1
                    ? "new member joined today!"
                    : "new members joined today!"}
                </div>
                <Link to={`/${rolePrefix}-members`} className="btn btn-primary">
                  View Members
                </Link>
              </div>
            )}

            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Admin Dashboard</h2>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="darkModeSwitch"
                      checked={darkMode}
                      onChange={toggleTheme}
                    />
                    <label
                      htmlFor="darkModeSwitch"
                      className="form-check-label"
                    >
                      {darkMode ? "Dark" : "Light"} Mode
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>
              <div className="col-lg-9 board">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card shadow border-0">
                      <div className="card-body p-3">
                        <h2>{data?.members?.count ?? 0}</h2>
                        <strong>Total Members</strong>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </div>
                  </div>

                  <div className="col-md-6 test">
                    <div className="card shadow border-0">
                      <div className="card-body p-3">
                        <h2>{data?.testimonials?.count ?? 0}</h2>
                        <strong>Testimonials</strong>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </div>
                  </div>
                </div>

                <div className="row g-3 py-5">
                  <div className="col-md-6 col-lg-6" ref={memberRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {memberInView ? (
                        <MembersStatsCard
                          totalMembers={data?.members?.count}
                          newMembers={data?.newMembers?.count}
                          trend={data?.newMembers?.trend}
                          growth={data?.newMembers?.growth}
                        />
                      ) : null}
                    </Suspense>
                  </div>

                  <div className="col-md-6" ref={eventRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {eventInView ? (
                        <DashboardEventsCard data={events} />
                      ) : null}
                    </Suspense>
                  </div>
                </div>

                <div className="row py-5">
                  <div className="col-md-6" ref={performanceRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {performanceInView ? <AdminPerformanceCard /> : null}
                    </Suspense>
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

export default React.memo(AdminDashboard);
