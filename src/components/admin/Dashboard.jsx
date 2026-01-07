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

  const { data: stats } = useDashboardStats({
    enabled: dashboardReady && !!token,
  });

  const { data: events } = useEvents({
    enabled: dashboardReady && !!token,
  });

  const { data: newMembers = [] } = useNewMembers({
    enabled: dashboardReady && !!token,
  });

  const today = dayjs().format("DD-MM-YYYY");

  const newMembersToday = useMemo(() => {
    if (!Array.isArray(newMembers)) return [];
    return newMembers.filter(
      (m) => dayjs(m.created_at).format("DD-MM-YYYY") === today
    );
  }, [newMembers, today]);

  /* =======================
     DERIVED VALUES (SAFE)
  ======================== */

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

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const TOTAL_TASKS = 5;
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
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminStatus"],
          queryFn: async () => {
            const res = await api.get("/admin-status");
            if (!cancelled) updateProgress();
            return res.data?.data ?? [];
          },
          staleTime: 60000,
        });

        await queryClient.prefetchQuery({
          queryKey: ["events"],
          queryFn: async () => {
            const { data } = await api.get("/events");
            if (!cancelled) updateProgress();
            return data.data;
          },
          staleTime: 60000,
        });

        await queryClient.prefetchQuery({
          queryKey: ["securityLogs", 1],
          queryFn: async () => {
            const res = await api.get("/security-logs?page=1");
            updateProgress();
            return res.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["adminActivities", 1],
          queryFn: async () => {
            const { data } = await api.get("/admin/activities?page=1");
            updateProgress();
            return data;
          },
        });
      } catch (err) {
        console.error("Dashboard preload failed:", err);
      } finally {
        if (!cancelled) setDashboardReady(true);
      }
    };

    prepareDashboard();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* =======================
     SAFE EARLY RETURNS
  ======================== */
  if (!dashboardReady) {
    return <DashboardPreloader progress={progress} />;
  }

  if (!token || !user) return null;
  /* =======================
     READ FROM CACHE ONLY
  ======================== */

  /* =======================
     RENDER
  ======================== */
  return (
    <Layout>
      <section className="dashboard">
        <div className="container pb-5 pt-3">
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
              <li className="breadcrumb-item active bread" aria-current="page">
                You are logged in as <strong>{user?.role}</strong>
              </li>
            </ol>
          </nav>

          {/* New members alert */}
          {newMembersToday.length > 0 && (
            <div className="alert alert-success d-flex justify-content-between align-items-center shadow mb-4">
              <div>
                🎉 <strong>{newMembersToday.length}</strong> new member(s)
                joined today
              </div>
              <Link to={`/${rolePrefix}-members`} className="btn btn-primary">
                View Members
              </Link>
            </div>
          )}

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Super Admin Dashboard</h2>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="darkModeSwitch"
                    checked={darkMode}
                    onChange={toggleTheme}
                  />
                  <label htmlFor="darkModeSwitch" className="form-check-label">
                    {darkMode ? "Dark" : "Light"} Mode
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-3 sidebar">
              <SideBar />
            </div>

            <div className="col-lg-9 board">
              {/* Top stats */}
              <div className="row">
                <div className="col-md-4">
                  <div className="card shadow border-0">
                    <div className="card-body p-3">
                      <h2>{stats?.members?.count ?? 0}</h2>
                      <strong>Total Members</strong>
                    </div>
                    <div className="card-footer">&nbsp;</div>
                  </div>
                </div>
                <div className="col-md-4 admins">
                  <div className="card shadow border-0">
                    <div className="card-body p-3">
                      <h2>{stats?.admins?.count ?? 0}</h2>
                      <strong>Total Admins</strong>
                    </div>
                    <div className="card-footer">&nbsp;</div>
                  </div>
                </div>
                <div className="col-md-4 test">
                  <div className="card shadow border-0">
                    <div className="card-body p-3">
                      <h2>{stats?.testimonials?.count ?? 0}</h2>
                      <strong>Testimonials</strong>
                    </div>
                    <div className="card-footer">&nbsp;</div>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="row g-3 py-5 ">
                <div className="col-md-6 col-lg-6" ref={adminRef}>
                  <Suspense fallback={<div style={{ height: 200 }}></div>}>
                    {adminInView ? (
                      <AdminStatsCard
                        active={stats?.admins?.active}
                        inactive={stats?.admins?.inactive}
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
                        totalMembers={stats?.members?.count}
                        newMembers={stats?.newMembers?.count}
                        trend={stats?.newMembers?.trend}
                        growth={stats?.newMembers?.growth}
                      />
                    ) : null}
                  </Suspense>
                </div>
              </div>

              <div className="row g-3 py-5">
                <div className="col-md-6" ref={eventRef}>
                  <Suspense fallback={<div style={{ height: 200 }}></div>}>
                    {eventInView ? <DashboardEventsCard data={events} /> : null}
                  </Suspense>
                </div>

                <div className="col-md-6" ref={adminActivityRef}>
                  <Suspense fallback={<div style={{ height: 200 }}></div>}>
                    {adminActivityInView ? (
                      <DashboardAdminActivityCard
                        data={stats?.admin_activity}
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
                <div className="col-md" ref={recentActivityRef}>
                  <Suspense fallback={<div style={{ height: 200 }}></div>}>
                    {recentActivityInView ? <RecentActivityCard /> : null}
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
