import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminPerformance = () => {
  return useQuery({
    queryKey: ["adminPerformance"],
    queryFn: async () => {
      const { data } = await api.get("/admin/activities/performance");
      return data?.data || [];
    },
    refetchInterval: false,
  });
};
