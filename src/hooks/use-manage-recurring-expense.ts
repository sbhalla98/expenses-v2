import { RecurringExpenseFormValues } from "@/components/common/recurring-expense-form";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddRecurringExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecurringExpenseFormValues) => {
      return await apiClient.post("/api/recurring-expenses", data);
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast({
        title: "Recurring expense added!",
        description: "Your recurring expense has been added successfully.",
      });
      onSuccess?.();
    },
  });
};

export const useEditRecurringExpense = (id: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecurringExpenseFormValues) => {
      return await apiClient.put(`/api/recurring-expenses`, { ...data, id });
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast({
        title: "Recurring expense updated!",
        description: "Your recurring expense has been updated successfully.",
      });
      onSuccess?.();
    },
  });
};

export const useDeleteRecurringExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/recurring-expenses?id=${id}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast({
        title: "Recurring expense deleted!",
        description: "Your recurring expense has been deleted successfully.",
      });
      onSuccess?.();
    },
  });
};
