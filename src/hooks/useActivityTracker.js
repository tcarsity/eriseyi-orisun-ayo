import React, { useEffect } from "react";

export default function useActivityTracker(onActivity) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, onActivity));

    return () =>
      events.forEach((event) => window.removeEventListener(event, onActivity));
  }, [onActivity]);
}
