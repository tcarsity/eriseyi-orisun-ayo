import { useQuery } from "@tanstack/react-query";
import React from "react";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn,
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};

export default useEvents;
