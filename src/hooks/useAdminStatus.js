import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminStatus = () => {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn: async () => {
      const { data } = await api.get("/admin-status");
      return data.data || [];
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
};
