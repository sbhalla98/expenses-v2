import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { Expense } from "@/store/use-config-store";
import { useQuery } from "@tanstack/react-query";

export const useSearchExpenses = (query: string) => {
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get(`/api/search-expenses?query=${query}`);
      return response.data.data;
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to search expenses",
      });
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
