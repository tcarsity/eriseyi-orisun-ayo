import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../components/context/AuthContext";

const fetchMembers = async () => {
  const res = await api.get("recent-public-members");
  return res.data?.data ?? [];
};

export const useNewMembers = ({ enabled = true } = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["recent-members"],
    queryFn: fetchMembers,
    staleTime: 1000 * 60,
    enabled: enabled && !!token,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
