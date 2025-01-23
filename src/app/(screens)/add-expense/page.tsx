"use client";

import AddExpenseForm from "./components/add-expense-form";

export default function AddExpense() {
  return (
    <div className="size-full flex flex-col overflow-y-auto">
      <AddExpenseForm />
    </div>
  );
}
