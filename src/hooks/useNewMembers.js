import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../components/context/AuthContext";

const fetchMembers = async () => {
  const { data } = await api.get("recent-public-members");
  return data.data || [];
};

export const useNewMembers = ({ enabled }) => {
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
