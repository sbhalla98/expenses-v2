import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useExpense = (id: string | null) => {
  const { toast } = useToast();

  const fetchExpense = async () => {
    if (!id) return null;
    try {
      const response = await apiClient.get(`/api/get-expense?id=${id}`);
      return response.data;
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch expense",
      });
      throw err;
    }
  };

  return useQuery({
    queryKey: ["expense", id],
    queryFn: fetchExpense,
    enabled: !!id,
  });
};
