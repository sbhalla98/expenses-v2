import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { Expense } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useSearchExpenses = (query: string) => {
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get(
        `${API_ROUTES.SEARCH_EXPENSES}?query=${query}`,
      );
      return response.data.data;
    } catch (err) {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
      throw err;
    }
  };

  return useQuery<Expense[]>({
    queryKey: ["search-expenses", query],
    queryFn: fetchExpenses,
    enabled: query.length > 2,
    staleTime: 0, // Always fetch fresh data for search
  });
};
