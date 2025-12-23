import React, { lazy, Suspense, useEffect, useState } from "react";
import Layout from "../common/Layout";
import Hero from "../common/Hero";
import About from "./About";
const Service = lazy(() => import("./Service"));
const Shepherd = lazy(() => import("./Shepherd"));
const Testimonial = lazy(() => import("./Testimonial"));
import EventsSection from "./EventsSection";
import Preloader from "../Preloader";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

const Home = () => {
  const queryClient = useQueryClient();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ["publicTestimonials"],
            queryFn: () =>
              api.get("/public-testimonials").then((res) => res.data),
          }),
          queryClient.prefetchQuery({
            queryKey: ["publicEvents"],
            queryFn: () => api.get("/public-events").then((res) => res.data),
          }),

          // queryClient.prefetchQuery({
          //   queryKey: ["adminActivities"],
          //   queryFn: () => api.get("/admin/activities").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["adminPerformance"],
          //   queryFn: () =>
          //     api.get("/admin/activities/performance").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["adminStatus"],
          //   queryFn: () => api.get("/admin-status").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["dashboardStats"],
          //   queryFn: () => api.get("/dashboard-stats").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["recent-members"],
          //   queryFn: () =>
          //     api.get("recent-public-members").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["securityLogs"],
          //   queryFn: () => api.get("/security-logs").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["testimonials"],
          //   queryFn: () => api.get("/testimonials").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["members"],
          //   queryFn: () => api.get("/members").then((res) => res.data),
          // }),

          // queryClient.prefetchQuery({
          //   queryKey: ["users"],
          //   queryFn: () => api.get("/users").then((res) => res.data),
          // }),
        ]);
      } catch (err) {
        console.error("App init error:", err);
      } finally {
        setAppReady(true);
      }
    };

    prepareApp();
  }, [queryClient]);

  if (!appReady) {
    return <Preloader />;
  }

  return (
    <>
      <Layout showAllLinks>
        <Hero />
        <About />
        <Suspense fallback={null}>
          <Service />
          <Shepherd />
          <Testimonial />
        </Suspense>

        <EventsSection />
      </Layout>
    </>
  );
};

export default Home;
