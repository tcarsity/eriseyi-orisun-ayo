import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminStatus = () => {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn,
    enabled,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
};
