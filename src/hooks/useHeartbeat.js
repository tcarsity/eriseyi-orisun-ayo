import { useEffect } from "react";
import api from "../api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../components/context/AuthContext";

export const useHeartbeat = () => {
  const queryClient = useQueryClient();
  const token = useAuth();

  useEffect(() => {
    if (!token) return;
    let alive = true;

    const sendHeartbeat = async () => {
      if (!alive) return;

      try {
        await api.post("/heartbeat");

        queryClient.invalidateQueries({
          queryKey: ["dashboardStats"],
        });
      } catch (_) {}
    };

    sendHeartbeat(); // send immediately on mount

    const interval = setInterval(sendHeartbeat, 60000); // every 60s

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [queryClient, token]);
};
