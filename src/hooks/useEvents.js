import { useQuery } from "@tanstack/react-query";
import React from "react";

export const useEvents = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data.data;
    },
    enabled,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};

export default useEvents;
