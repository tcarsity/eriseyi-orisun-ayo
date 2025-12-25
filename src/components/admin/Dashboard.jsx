import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideBar from "../admincontrol/SideBar";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useInView } from "react-intersection-observer";
import useEvents from "../../hooks/useEvents";
import { useNewMembers } from "../../hooks/useNewMembers";
import dayjs from "dayjs";
import SecurityLogCard from "./SecurityLogCard";
import { useTheme } from "../context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import DashboardPreloader from "../DashboardPreloader";
const ActiveAdminsCard = lazy(() => import("./ActiveAdminsCard"));

const RecentActivityCard = lazy(() => import("./RecentActivityCard"));
const DashboardAdminActivityCard = lazy(() =>
  import("./DashboardAdminActivityCard")
);
const DashboardEventsCard = lazy(() => import("./DashboardEventsCard"));
const AdminStatsCard = lazy(() => import("./AdminStatsCard"));
const MembersStatsCard = lazy(() => import("./MembersStatsCard"));

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user, greeting, token } = useAuth(); // from AuthContext
  const [dashboardReady, setDashboardReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user || !token) return;

    const TOTAL_TASKS = 7; // adjust if you add/remove APIs
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
            const res = await api.get("/dashboard-stats");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminActivities"],
          queryFn: async () => {
            const res = await api.get("/admin/activities");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["recent-members"],
          queryFn: async () => {
            const res = await api.get("recent-public-members");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["securityLogs"],
          queryFn: async () => {
            const res = await api.get("/security-logs");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["events"],
          queryFn: async () => {
            const res = await api.get("/events");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminStatus"],
          queryFn: async () => {
            const res = await api.get("/admin-status");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminPerformance"],
          queryFn: async () => {
            const res = await api.get("/admin/activities/performance");
            updateProgress();
            return res.data;
          },
        });
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setDashboardReady(true);
      }
    };

    prepareDashboard();
  }, [user, token, queryClient]);

  if (!dashboardReady) {
    return <DashboardPreloader progress={progress} />;
  }

  const { ref: adminRef, inView: adminInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: adminStatusRef, inView: adminStatusInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: memberRef, inView: memberInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: eventRef, inView: eventInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: adminActivityRef, inView: adminActivityInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: securityLogRef, inView: securityLogInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: recentAdminActivityRef, inView: recentAdminActivityInView } =
    useInView({
      triggerOnce: true,
      threshold: 0.2,
    });

  const { events, isLoading, error } = useEvents();

  const {
    data,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const { data: newMembers = [] } = useNewMembers();

  const today = dayjs().format("DD-MM-YYYY");

  const newMembersToday = useMemo(() => {
    return newMembers.filter((m) => {
      const joinedDate = dayjs(m.created_at).format("DD-MM-YYYY");
      return joinedDate === today;
    });
  }, [newMembers, today]);

  const newMembersCount = newMembersToday.length;

  const { darkMode, toggleTheme } = useTheme();

  const rolePrefix = useMemo(
    () => (user?.role === "superadmin" ? "superadmin" : "admin"),
    [user?.role]
  );

  const CardLoader = () => (
    <div className="card shadow-sm border-0 p-4 text-center text-muted">
      <div className="spinner-border text-success mb-2" role="status"></div>
      <div>Loading chart...</div>
    </div>
  );

  if (!user) return null;
  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container py-3">
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
                  <h2 className="h4 mb-2 pb-0">Super Admin Dashboard</h2>
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
                  <div className="col-md-4">
                    <div className="card shadow border-0">
                      <div className="card-body p-3">
                        <h2>{data?.members?.count ?? 0}</h2>
                        <strong>Total Members</strong>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </div>
                  </div>
                  <div className="col-md-4 admins">
                    <div className="card shadow border-0">
                      <div className="card-body p-3">
                        <h2>{data?.admins?.count ?? 0}</h2>
                        <strong>Total Admins</strong>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </div>
                  </div>
                  <div className="col-md-4 test">
                    <div className="card shadow border-0">
                      <div className="card-body p-3">
                        <h2>{data?.testimonials?.count ?? 0}</h2>
                        <strong>Testimonials</strong>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </div>
                  </div>
                </div>

                <div className="row g-3 py-5 ">
                  <div className="col-md-6 col-lg-6" ref={adminRef}>
                    <Suspense fallback={<CardLoader />}>
                      {adminInView ? (
                        <AdminStatsCard
                          active={data?.admins?.active}
                          inactive={data?.admins?.inactive}
                        />
                      ) : null}
                    </Suspense>
                  </div>

                  <div className="col-md-6 col-lg-6" ref={adminStatusRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {adminStatusInView ? <ActiveAdminsCard /> : null}
                    </Suspense>
                  </div>
                </div>

                <div className="row py-5">
                  <div className="col-md-12" ref={memberRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {memberInView ? (
                        <MembersStatsCard
                          totalMembers={data?.members?.count}
                          newMembers={data?.newMembers?.count}
                          trend={data?.newMembers?.trend}
                          growth={data?.newMembers?.growth}
                          isLoading={statsLoading}
                          error={statsError}
                        />
                      ) : null}
                    </Suspense>
                  </div>
                </div>

                <div className="row g-3 py-5">
                  <div className="col-md-6" ref={eventRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {eventInView ? (
                        <DashboardEventsCard
                          data={events}
                          isLoading={isLoading}
                          error={error}
                        />
                      ) : null}
                    </Suspense>
                  </div>

                  <div className="col-md-6" ref={adminActivityRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {adminActivityInView ? (
                        <DashboardAdminActivityCard
                          data={data?.admin_activity}
                          isLoading={statsLoading}
                          error={statsError}
                        />
                      ) : null}
                    </Suspense>
                  </div>
                </div>

                <div className="row py-5">
                  <div className="col-md" ref={securityLogRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {securityLogInView ? <SecurityLogCard /> : null}
                    </Suspense>
                  </div>
                </div>

                <div className="row py-5">
                  <div className="col-md" ref={recentAdminActivityRef}>
                    <Suspense fallback={<div style={{ height: 200 }}></div>}>
                      {recentAdminActivityInView ? (
                        <RecentActivityCard />
                      ) : null}
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

export default React.memo(Dashboard);
