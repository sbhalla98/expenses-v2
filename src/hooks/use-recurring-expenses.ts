import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useRecurringExpenses = () => {
  const { toast } = useToast();

  const fetchRecurringExpenses = async () => {
    try {
      const response = await apiClient.get("/api/recurring-expenses");
      return response.data.data;
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch recurring expenses",
      });
      throw err;
    }
  };

  return useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: fetchRecurringExpenses,
  });
};
