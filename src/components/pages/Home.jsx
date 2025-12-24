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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prepareApp = async () => {
      const tasks = [
        () =>
          queryClient.prefetchQuery({
            queryKey: ["publicTestimonials"],
            queryFn: () =>
              api.get("/public-testimonials").then((res) => res.data),
          }),

        () =>
          queryClient.prefetchQuery({
            queryKey: ["publicEvents"],
            queryFn: () => api.get("/public-events").then((res) => res.data),
          }),
      ];

      const total = tasks.length;
      let completed = 0;

      try {
        await Promise.all(
          tasks.map(async (task) => {
            await task();
            completed += 1;
            setProgress(Math.round((completed / total) * 100));
          })
        );
      } catch (err) {
        console.error("App init error:", err);
      } finally {
        setAppReady(true);
      }
    };

    prepareApp();
  }, [queryClient]);

  if (!appReady) {
    return <Preloader progress={progress} />;
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
