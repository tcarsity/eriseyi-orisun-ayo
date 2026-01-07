import { useQuery } from "@tanstack/react-query";
import React from "react";
import api from "../api/axios";

export const useEvents = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data.data;
    },
    enabled,
    staleTime: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useEvents;
