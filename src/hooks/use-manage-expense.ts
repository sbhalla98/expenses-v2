import { AddExpensesFormValues } from "@/components/common/add-expense-form";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExpensesFormValues) => {
      return await apiClient.post("/api/add-expense", data);
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense added!",
        description: "Your expense has been added successfully.",
      });
      onSuccess?.();
    },
  });
};

export const useEditExpense = (id: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExpensesFormValues) => {
      return await apiClient.post(`/api/edit-expense`, { ...data, id });
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense", id] });
      toast({
        title: "Expense updated!",
        description: "Your expense has been updated successfully.",
      });
      onSuccess?.();
    },
  });
};

export const useDeleteExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.post(`/api/delete-expense`, { id });
    },
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense deleted!",
        description: "Your expense has been deleted successfully.",
      });
      onSuccess?.();
    },
  });
};
