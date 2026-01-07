import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminPerformance = () => {
  return useQuery({
    queryKey: ["adminPerformance"],
    queryFn: async () => {
      const res = await api.get("/admin/activities/performance");
      return res.data?.data ?? [];
    },

    retry: false,
    refetchOnMount: false,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};
