import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useDashboardStats = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard-stats");
      updateProgress();
      return data;
    },
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
