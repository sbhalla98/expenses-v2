import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export const useExpense = (id: string | null) => {
  const { toast } = useToast();

  const fetchExpense = async () => {
    if (!id) return null;
    try {
      const response = await apiClient.get(`${API_ROUTES.GET_EXPENSE}?id=${id}`);
      return response.data;
    } catch (err) {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
      throw err;
    }
  };

  return useQuery({
    queryKey: ["expense", id],
    queryFn: fetchExpense,
    enabled: !!id,
  });
};
