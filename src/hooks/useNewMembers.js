import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../components/context/AuthContext";

const fetchMembers = async () => {
  const { data } = await api.get("recent-public-members");
  return data.data || [];
};

export const useNewMembers = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["recent-members"],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
