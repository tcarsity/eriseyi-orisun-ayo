import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../common/Layout";
import SideBar from "../admincontrol/SideBar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import dayjs from "dayjs";
import api from "../../api/axios";
import DashboardPreloader from "../DashboardPreloader";

// hooks (READ FROM CACHE ONLY)
import { useDashboardStats } from "../../hooks/useDashboardStats";
import useEvents from "../../hooks/useEvents";
import { useNewMembers } from "../../hooks/useNewMembers";

// lazy cards
const ActiveAdminsCard = lazy(() => import("./ActiveAdminsCard"));
const RecentActivityCard = lazy(() => import("./RecentActivityCard"));
const SecurityLogCard = lazy(() => import("./SecurityLogCard"));
const DashboardAdminActivityCard = lazy(() =>
  import("./DashboardAdminActivityCard")
);
const DashboardEventsCard = lazy(() => import("./DashboardEventsCard"));
const AdminStatsCard = lazy(() => import("./AdminStatsCard"));
const MembersStatsCard = lazy(() => import("./MembersStatsCard"));

const Dashboard = () => {
  /* =======================
     GLOBAL HOOKS (TOP ONLY)
  ======================== */
  const { user, greeting, token } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  const [dashboardReady, setDashboardReady] = useState(false);
  const [progress, setProgress] = useState(0);

  /* =======================
     READ FROM CACHE ONLY
  ======================== */
  const { data: stats } = useDashboardStats({ enabled: dashboardReady });

  const { events } = useEvents({ enabled: dashboardReady });

  const { data: newMembers = [] } = useNewMembers({
    enabled: dashboardReady,
  });

  /* =======================
     DERIVED VALUES (SAFE)
  ======================== */
  const today = dayjs().format("DD-MM-YYYY");

  const newMembersToday = useMemo(() => {
    if (!Array.isArray(newMembers)) return [];
    return newMembers.filter(
      (m) => dayjs(m.created_at).format("DD-MM-YYYY") === today
    );
  }, [newMembers, today]);

  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  /* =======================
     IN VIEW
  ======================== */
  const inViewConfig = { triggerOnce: true, threshold: 0.2 };

  const [adminRef, adminInView] = useInView(inViewConfig);
  const [adminStatusRef, adminStatusInView] = useInView(inViewConfig);
  const [memberRef, memberInView] = useInView(inViewConfig);
  const [eventRef, eventInView] = useInView(inViewConfig);
  const [adminActivityRef, adminActivityInView] = useInView(inViewConfig);
  const [securityLogRef, securityLogInView] = useInView(inViewConfig);
  const [recentActivityRef, recentActivityInView] = useInView(inViewConfig);

  /* =======================
     DASHBOARD PRELOADER
     (RUNS ONCE)
  ======================== */
  useEffect(() => {
    if (!user || !token) return;

    const TOTAL_TASKS = 6;
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
            return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminActivities"],
          queryFn: async () => {
            const res = await api.get("/admin/activities");
            updateProgress();
            return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["recent-members"],
          queryFn: async () => {
            const res = await api.get("/recent-public-members");
            updateProgress();
            return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["securityLogs"],
          queryFn: async () => {
            const res = await api.get("/security-logs");
            updateProgress();
            return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["events"],
          queryFn: async () => {
            const res = await api.get("/events");
            updateProgress();
            return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminStatus"],
          queryFn: async () => {
            const res = await api.get("/admin-status");
            updateProgress();
            return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
          },
        });
      } catch (err) {
        console.error("Dashboard preload failed:", err);
      } finally {
        setDashboardReady(true);
      }
    };

    prepareDashboard();
  }, [user, token, queryClient]);

  /* =======================
     SAFE EARLY RETURNS
  ======================== */
  if (!dashboardReady) {
    return <DashboardPreloader progress={progress} />;
  }

  if (!user) return null;

  const CardLoader = () => (
    <div className="card shadow-sm border-0 p-4 text-center text-muted">
      <div className="spinner-border text-success mb-2" />
      Loading...
    </div>
  );

  /* =======================
     RENDER
  ======================== */
  return (
    <Layout>
      <section className="dashboard">
        <div className="container py-3">
          {/* Breadcrumb */}
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
              <li className="breadcrumb-item active">
                Logged in as <strong>{user.role}</strong>
              </li>
            </ol>
          </nav>

          {/* New members alert */}
          {newMembersToday.length > 0 && (
            <div className="alert alert-success d-flex justify-content-between align-items-center mb-4">
              <div>
                🎉 <strong>{newMembersToday.length}</strong> new member(s)
                joined today
              </div>
              <Link to={`/${rolePrefix}-members`} className="btn btn-primary">
                View Members
              </Link>
            </div>
          )}

          <div className="d-flex justify-content-between mb-4">
            <h2>Super Admin Dashboard</h2>

            {/* DARK MODE — KEPT */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <label className="form-check-label">
                {darkMode ? "Dark" : "Light"} Mode
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3">
              <SideBar />
            </div>

            <div className="col-lg-9">
              {/* Top stats */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card shadow border-0 p-3">
                    <h2>{stats?.members?.count ?? 0}</h2>
                    <strong>Total Members</strong>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow border-0 p-3">
                    <h2>{stats?.admins?.count ?? 0}</h2>
                    <strong>Total Admins</strong>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow border-0 p-3">
                    <h2>{stats?.testimonials?.count ?? 0}</h2>
                    <strong>Testimonials</strong>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="row g-4">
                <div className="col-md-6" ref={adminRef}>
                  <Suspense fallback={<CardLoader />}>
                    {adminInView && (
                      <AdminStatsCard
                        active={stats?.admins?.active}
                        inactive={stats?.admins?.inactive}
                      />
                    )}
                  </Suspense>
                </div>

                <div className="col-md-6" ref={adminStatusRef}>
                  <Suspense fallback={<CardLoader />}>
                    {adminStatusInView && <ActiveAdminsCard />}
                  </Suspense>
                </div>

                <div className="col-md-12" ref={memberRef}>
                  <Suspense fallback={<CardLoader />}>
                    {memberInView && (
                      <MembersStatsCard
                        totalMembers={stats?.members?.count}
                        newMembers={stats?.newMembers?.count}
                        trend={stats?.newMembers?.trend}
                        growth={stats?.newMembers?.growth}
                      />
                    )}
                  </Suspense>
                </div>

                <div className="col-md-6" ref={eventRef}>
                  <Suspense fallback={<CardLoader />}>
                    {eventInView && <DashboardEventsCard data={events} />}
                  </Suspense>
                </div>

                <div className="col-md-6" ref={adminActivityRef}>
                  <Suspense fallback={<CardLoader />}>
                    {adminActivityInView && (
                      <DashboardAdminActivityCard
                        data={stats?.admin_activity}
                      />
                    )}
                  </Suspense>
                </div>

                <div className="col-md-12" ref={securityLogRef}>
                  <Suspense fallback={<CardLoader />}>
                    {securityLogInView && <SecurityLogCard />}
                  </Suspense>
                </div>

                <div className="col-md-12" ref={recentActivityRef}>
                  <Suspense fallback={<CardLoader />}>
                    {recentActivityInView && <RecentActivityCard />}
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default React.memo(Dashboard);
