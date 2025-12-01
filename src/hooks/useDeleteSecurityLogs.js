import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useDeleteSecurityLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      const res = await api.post("/security-logs/bulk-delete", { ids });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Security Logs Deleted Successfully");
      queryClient.invalidateQueries(["securityLogs"]);
    },
  });
};
