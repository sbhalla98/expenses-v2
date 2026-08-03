import { Expense } from "@/lib/types";
import React from "react";
import { ExpenseItem } from "./expense-item";

const ExpenseList: React.FC<{
  expenses: Expense[];
  isSelectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onStartSelectionMode?: (id: string) => void;
}> = ({
  expenses,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelect,
  onStartSelectionMode,
}) => {
  const sortedExpenses = expenses.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      {expenses.length > 0 ? (
        <ul className="flex flex-col gap-2 p-2">
          {sortedExpenses.map((expense, index) => (
            <ExpenseItem
              expense={expense}
              key={expense.id + index}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(expense.id)}
              onToggleSelect={onToggleSelect}
              onStartSelectionMode={onStartSelectionMode}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-10">No expenses.</p>
      )}
    </>
  );
};

export default ExpenseList;
