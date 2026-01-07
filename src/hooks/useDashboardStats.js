import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard-stats");
      return data;
    },
    staleTime: 0,
    refetchInterval: true,
    refetchOnMount: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
