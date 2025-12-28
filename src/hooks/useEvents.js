import { useQuery } from "@tanstack/react-query";
import React from "react";
import api from "../api/axios";

export const useEvents = () => {
  const query = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data.data;
    },
  });
  return {
    events: query.data ?? [],
    error: query.error,
  };
};

export default useEvents;
