import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../components/context/AuthContext";

const fetchMembers = async () => {
  const res = await api.get("admin/recent-members");
  return res.data?.data ?? [];
};

export const useNewMembers = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["recent-members"],
    queryFn: fetchMembers,
    enabled: !!token,
    staleTime: 1000 * 60,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
