import React, { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { FaUsers } from "react-icons/fa";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

const MembersStatsCard = ({
  totalMembers,
  newMembers,
  trend = [],
  growth = 0,
  isLoading,
  error,
}) => {
  const chartRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  const labels = trend.map((item) =>
    new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })
  );

  const counts = trend.map((item) => item.count);

  const isGrowthPositive = growth >= 0;

  if (!isGrowthPositive && counts.length > 1) {
    counts.sort((a, b) => b - a);
  }

  useEffect(() => {
    if (chartRef.current && chartRef.current.canvas) {
      const canvas = chartRef.current.canvas;

      //Glow + Animate chart movement when growth changes
      canvas.style.transition = "transform 0.6s ease";
      canvas.style.boxShadow = isGrowthPositive
        ? "0 0 12px rgba(25, 135, 84, 0.4)"
        : "0 0 12px rgba(220, 53, 69, 0.4)";
      canvas.style.transform = isGrowthPositive
        ? "translateY(-5px) scale(1.02)" // green
        : "translateY(5px) scale(0.98)"; // red

      const timeout = setTimeout(() => {
        canvas.style.transform = "translateY(0) scale(1)";
        canvas.style.boxShadow = "none";
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [isGrowthPositive]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "New Members",
          data: counts,
          borderColor: isGrowthPositive ? "#198754" : "#dc3545",
          backgroundColor: isGrowthPositive
            ? "rgba(24, 135, 84, 0.15)"
            : "rgba(220, 53, 69, 0.15)",
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [labels, counts, isGrowthPositive]
  );

  const chartOptions = {
    animation: { duration: 1500, easing: "easeOutQuart" },
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { display: false },
      y: {
        display: false,
        beginAtZero: true,
        suggestedMax: Math.max(...counts) + 2,
      },
    },
    elements: {
      point: { radius: counts.length <= 2 ? 4 : 2 },
      line: { borderWidth: 3 },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    setTimeout(() => {
      const canvas = chartRef?.current?.canvas;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.style.width = "100%";
        window.dispatchEvent(new Event("resize"));
      }
    }, 400);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 150);
      }
    };
    window.addEventListener("orientationchange", handleResize);
    return () => window.removeEventListener("orientationchange", handleResize);
  }, []);

  return (
    <div className="card shadow border-0 p-3 d-flex flex-column justify-content-between h-100 ">
      {isLoading && (
        <div className="text-center p-4">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "2rem", height: "2rem" }}
          ></div>
        </div>
      )}

      {error && (
        <div className="text-center text-danger p-4">
          Failed to load member status
        </div>
      )}

      <div>
        <h6 className="text-muted mb-1">Members</h6>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold text-success mb-0">
            <FaUsers /> {totalMembers}
          </h3>

          <span
            className={`badge ${
              growth >= 0
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
            } text-black`}
          >
            {growth >= 0 ? "⬆" : "⬇"} +{Math.abs(growth)}
          </span>
        </div>

        <p className="badge bg-success-subtle text-success">
          +{newMembers} this week
        </p>
      </div>

      <div className="chart-wrapper mt-2" ref={chartRef}>
        {isVisible && (
          <div
            key={`${growth >= 0 ? "green" : "red"}`}
            style={{ position: "relative", width: "100%", height: "80px" }}
          >
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MembersStatsCard);
