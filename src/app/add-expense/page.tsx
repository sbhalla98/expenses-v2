"use client";

import { useToast } from "@/hooks/use-toast";
import AddExpenseForm, {
  AddExpensesFormValues,
} from "./components/add-expense-form";

export default function AddExpense() {
  const { toast } = useToast();

  const onAddExpense = async (expense: AddExpensesFormValues) => {
    try {
      const response = await fetch("/api/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });
      console.log("response", response);

      toast({
        title: "Expense added!",
        description: "Your expense has been added successfully.",
      });
    } catch (e) {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    }
  };
  return <AddExpenseForm onAddExpense={onAddExpense} />;
}
