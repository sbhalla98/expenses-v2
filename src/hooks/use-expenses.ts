import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useExpenses = () => {
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get("/api/get-expenses");
      return response.data;
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch expenses",
      });
      throw err;
    }
  };

  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
