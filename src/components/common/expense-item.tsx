import { getAmountLabel } from "@/lib/utils";
import { Expense } from "./expense-list";

type ExpenseItemProps = {
  expense: Expense;
};

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const { category, amount, description, date, paidBy, paidFor } =
    expense ?? {};

  const paidByLabel = paidBy ? `${paidBy} paid` : "";
  const dateLabel = new Date(date)?.toLocaleDateString();

  if (!expense) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-gray-700">{category}</span>
        <span className="text-xs text-gray-500">{description}</span>
        <span className="text-xs text-gray-500">{dateLabel}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-500">{paidByLabel}</span>
        <span className="text-lg font-bold text-gray-800">
          {getAmountLabel(amount)}
        </span>
      </div>
    </div>
  );
}
