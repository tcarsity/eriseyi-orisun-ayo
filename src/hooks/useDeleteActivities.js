import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useDeleteActivities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      const res = await api.post("/admin-activities/bulk-delete", { ids });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminActivities"]);
      toast.success("Activities Deleted Successfully");
    },
  });
};
