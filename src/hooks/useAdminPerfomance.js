import { useQuery } from "@tanstack/react-query";

export const useAdminPerformance = () => {
  return useQuery({
    queryKey: ["adminPerformance"],
    queryFn,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
