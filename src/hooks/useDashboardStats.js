import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useDashboardStats = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard-stats");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
