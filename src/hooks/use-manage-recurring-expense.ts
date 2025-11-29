import { RecurringExpenseFormValues } from "@/components/common/recurring-expense-form";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { API_ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddRecurringExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecurringExpenseFormValues) => {
      return await apiClient.post(API_ROUTES.RECURRING_EXPENSES, data);
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast(TOAST_MESSAGES.EXPENSE_ADDED);
      onSuccess?.();
    },
  });
};

export const useEditRecurringExpense = (id: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecurringExpenseFormValues) => {
      return await apiClient.put(API_ROUTES.RECURRING_EXPENSES, { ...data, id });
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast(TOAST_MESSAGES.EXPENSE_UPDATED);
      onSuccess?.();
    },
  });
};

export const useDeleteRecurringExpense = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ROUTES.RECURRING_EXPENSES}?id=${id}`);
    },
    onError: () => {
      toast(TOAST_MESSAGES.GENERIC_ERROR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast(TOAST_MESSAGES.EXPENSE_DELETED);
      onSuccess?.();
    },
  });
};
