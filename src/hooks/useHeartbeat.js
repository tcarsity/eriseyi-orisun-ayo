import { useEffect } from "react";
import api from "../api/axios";

export const useHeartbeat = () => {
  useEffect(() => {
    const sendHeartbeat = () => {
      api.post("/heartbeat").catch(() => {});
    };

    sendHeartbeat(); // send immediately on mount

    const interval = setInterval(sendHeartbeat, 45000); // every 45s

    return () => clearInterval(interval);
  }, []);
};
