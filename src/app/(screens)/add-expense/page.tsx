"use client";

import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { Expense } from "@/store/use-config-store";
import { useMutation } from "@tanstack/react-query";
import AddExpenseForm, {
  AddExpensesFormValues,
} from "./components/add-expense-form";

export default function AddExpense() {
  const { toast } = useToast();

  const handleAddExpense = async (expense: Expense) => {
    return await apiClient.post("/api/add-expense", expense);
  };
  const { mutate, isPending } = useMutation<unknown, Error, Expense>({
    mutationFn: handleAddExpense,
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Expense added!",
        description: "Your expense has been added successfully.",
      });
    },
  });

  const onAddExpense = async (expense: AddExpensesFormValues) => {
    mutate(expense as Expense);
  };

  return (
    <div className="size-full flex flex-col overflow-y-auto">
      <AddExpenseForm onAddExpense={onAddExpense} loading={isPending} />
    </div>
  );
}
