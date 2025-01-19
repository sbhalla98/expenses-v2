import React from "react";
import { ExpenseItem } from "./expense-item";

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paidBy?: string;
  paidFor?: string;
};

const ExpenseList: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const sortedExpenses = expenses.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      {expenses.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6">
          {sortedExpenses.map((expense) => (
            <ExpenseItem expense={expense} key={expense.id} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-10">No expenses.</p>
      )}
    </>
  );
};

export default ExpenseList;
