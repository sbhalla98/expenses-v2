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
        <ul className="flex flex-col gap-2 p-2">
          {sortedExpenses.map((expense, index) => (
            <ExpenseItem expense={expense} key={expense.id + index} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-10">No expenses.</p>
      )}
    </>
  );
};

export default ExpenseList;
