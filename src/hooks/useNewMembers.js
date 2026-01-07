import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchMembers = async () => {
  const res = await api.get("recent-public-members");
  return res.data?.data ?? [];
};

export const useNewMembers = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["recent-members"],
    queryFn: fetchMembers,
    enabled,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
