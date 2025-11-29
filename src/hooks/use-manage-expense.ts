import { AddExpensesFormValues } from "@/components/common/add-expense-form";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExpensesFormValues) => {
      return await apiClient.post(API_ROUTES.ADD_EXPENSE, data);
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast(TOAST_MESSAGES.EXPENSE_ADDED);
      onSuccess?.();
    },
  });
};

export const useEditExpense = (id: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExpensesFormValues) => {
      return await apiClient.post(API_ROUTES.EDIT_EXPENSE, { ...data, id });
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense", id] });
      toast(TOAST_MESSAGES.EXPENSE_UPDATED);
      onSuccess?.();
    },
  });
};

export const useDeleteExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.post(API_ROUTES.DELETE_EXPENSE, { id });
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast(TOAST_MESSAGES.EXPENSE_DELETED);
      onSuccess?.();
    },
  });
};
