import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useSecurityLogs = (page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["securityLogs", page],
    queryFn: async () => {
      const res = await api.get(`/security-logs?page=${page}`);
      return res.data;
    },
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
