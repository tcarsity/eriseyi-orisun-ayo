import { useQuery } from "@tanstack/react-query";
import React from "react";

export const useEvents = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["events"],
    queryFn,
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};

export default useEvents;
