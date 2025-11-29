import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { RecurringExpense } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useRecurringExpenses = () => {
  const { toast } = useToast();

  const fetchRecurringExpenses = async () => {
    try {
      const response = await apiClient.get(API_ROUTES.RECURRING_EXPENSES);
      return response.data.data;
    } catch (err) {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
      throw err;
    }
  };

  return useQuery<RecurringExpense[]>({
    queryKey: ["recurring-expenses"],
    queryFn: fetchRecurringExpenses,
  });
};
