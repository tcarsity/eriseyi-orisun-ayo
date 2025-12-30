import { useQuery } from "@tanstack/react-query";

export const useAdminPerformance = ({ enabled }) => {
  return useQuery({
    queryKey: ["adminPerformance"],
    queryFn,
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
