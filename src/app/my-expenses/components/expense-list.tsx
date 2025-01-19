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
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense List</h2>
      {expenses.length > 0 ? (
        <ul className="grid grid-cols-1  gap-6">
          {expenses.map((expense) => (
            <ExpenseItem expense={expense} key={expense.id} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No expenses added yet. Start tracking your expenses!
        </p>
      )}
    </div>
  );
};

export default ExpenseList;
