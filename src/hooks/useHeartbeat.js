import { useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../components/context/AuthContext";

export const useHeartbeat = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const sendHeartbeat = () => {
      api.post("/heartbeat").catch(() => {});
    };

    sendHeartbeat(); // send immediately on mount

    const interval = setInterval(sendHeartbeat, 30000); // every 30s

    return () => clearInterval(interval);
  }, [token]);
};
