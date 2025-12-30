import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn,
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
