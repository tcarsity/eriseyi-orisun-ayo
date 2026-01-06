import { useEffect } from "react";
import api from "../api/axios";

export const useHeartbeat = () => {
  useEffect(() => {
    const sendHeartbeat = () => {
      api.post("/heartbeat").catch(() => {});
    };

    sendHeartbeat(); // send immediately on mount

    const interval = setInterval(sendHeartbeat, 30000); // every 30s

    return () => clearInterval(interval);
  }, []);
};
