import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export const useExpenses = () => {
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get(API_ROUTES.GET_EXPENSES);
      return response.data;
    } catch (err) {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
      throw err;
    }
  };

  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
