import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminActivities = (page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["adminActivities", page],
    queryFn: async () => {
      const { data } = await api.get(`/admin/activities?page=${page}`);
      return data;
    },
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
