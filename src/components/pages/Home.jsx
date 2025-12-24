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
  const TOTAL_TASKS = 2;

  useEffect(() => {
    const prepareApp = async () => {
      let completed = 0;

      const updateProgress = () => {
        completed += 1;
        setProgress(Math.round((completed / TOTAL_TASKS) * 100));
      };

      try {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ["publicTestimonials"],
            queryFn: async () => {
              const res = await api.get("/public-testimonials");
              updateProgress();
              return res.data;
            },
          }),

          queryClient.prefetchQuery({
            queryKey: ["publicEvents"],
            queryFn: async () => {
              const res = await api.get("/public-events");
              updateProgress();
              return res.data;
            },
          }),
        ]);
      } catch (err) {
        console.error("App init error:", err);
      } finally {
        setTimeout(() => {
          setAppReady(true);
        }, 300); // small delay so 100% is visible
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
