import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminActivities = (page) => {
  return useQuery({
    queryKey: ["adminActivities", page],
    queryFn: async () => {
      const { data } = await api.get(`/admin/activities?page=${page}`);
      return data;
    },
    keepPreviousData: true,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });
};
