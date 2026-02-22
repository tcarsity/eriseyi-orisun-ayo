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
import { Helmet } from "react-helmet-async";

const Home = () => {
  const queryClient = useQueryClient();
  const TOTAL_TASKS = 2;

  const [appReady, setAppReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prepareApp = async () => {
      let completed = 0;

      const updateProgress = () => {
        completed += 1;
        setProgress(Math.round((completed / TOTAL_TASKS) * 100));
      };

      try {
        await queryClient.prefetchQuery({
          queryKey: ["publicTestimonials"],
          queryFn: async () => {
            const res = await api.get("/public-testimonials");
            updateProgress();
            return res.data.data;
          },
        });

        await queryClient.prefetchQuery({
          queryKey: ["publicEvents"],
          queryFn: async () => {
            const res = await api.get("/public-events");
            updateProgress();
            return res.data.data;
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setAppReady(true), 300); // smooth exit
      }
    };

    prepareApp();
  }, [queryClient]);

  if (!appReady) {
    return <Preloader progress={progress} />;
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",

            "@type": "Church",

            name: "C & S Eriseyi Orisun Ayo",

            url: "https://eriseyi-orisun-ayo.vercel.app",

            address: {
              "@type": "PostalAddress",

              addressLocality: "Lagos",

              addressCountry: "Nigeria",
            },
          })}
        </script>
        <title>
          C & S Eriseyi Orisun Ayo | Cherubim & Seraphim Church in Lagos
        </title>

        <meta
          name="description"
          content="C & S Eriseyi Orisun Ayo is a Cherubim and Seraphim church in Lagos focused on worship, spiritual growth, and community service."
        />

        <link rel="canonical" href="https://eriseyi-orisun-ayo.vercel.app/" />

        {/* Open Graph */}

        <meta property="og:title" content="C & S Eriseyi Orisun Ayo" />

        <meta
          property="og:description"
          content="Join us for worship and spiritual growth in Lagos."
        />

        <meta
          property="og:image"
          content="https://eriseyi-orisun-ayo.vercel.app/rosary.webp"
        />

        <meta property="og:type" content="website" />
      </Helmet>
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
