import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminStatus = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn: async () => {
      const res = await api.get("/admin-status");
      return res.data?.data ?? [];
    },
    enabled,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
};
