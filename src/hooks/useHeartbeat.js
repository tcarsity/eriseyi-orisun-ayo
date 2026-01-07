import { useEffect } from "react";
import api from "../api/axios";

export const useHeartbeat = () => {
  useEffect(() => {
    let alive = true;

    const sendHeartbeat = () => {
      if (!alive) return;
      api.post("/heartbeat").catch(() => {});
    };

    sendHeartbeat(); // send immediately on mount

    const interval = setInterval(sendHeartbeat, 60000); // every 45s

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);
};
