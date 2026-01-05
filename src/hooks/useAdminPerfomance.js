import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminPerformance = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["adminPerformance"],
    queryFn: async () => {
      const res = await api.get("/admin/activities/performance");
      return res.data?.data ?? [];
    },
    enabled,
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
