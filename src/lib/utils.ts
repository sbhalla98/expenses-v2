import { Expense } from "@/store/use-config-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAmountLabel = (amount: string | number) => {
  if (amount === null || amount === undefined || isNaN(Number(amount)))
    return "";
  return `₹ ${Math.round(Number(amount)).toLocaleString("en-IN")}`;
};

export const getExpenseAmount = (expense: Expense[] = []) => {
  return expense.reduce((a, b) => a + Number(b.amount), 0);
};

export function groupByKey<T>(data: T[], key: keyof T): Record<string, T[]> {
  if (!Array.isArray(data)) {
    throw new Error("The first argument must be an array.");
  }

  return data.reduce((grouped: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key]); // Convert key to string for safe object key usage
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
    return grouped;
  }, {});
}

export const getGroupedByDate = (expenses: Expense[]) => {
  const expensesWithLocalDate = expenses
    .sort(
      (a, b) => new Date(b.date)?.getTime?.() - new Date(a.date)?.getTime?.()
    )
    .map((expenses) => ({
      ...expenses,
      localDate: new Date(expenses.date)?.toLocaleDateString(),
    }));
  const groupedData = groupByKey(expensesWithLocalDate, "localDate");

  return Object.keys(groupedData).map((key) => ({
    title: key,
    data: groupedData[key],
    amount: getExpenseAmount(groupedData[key]),
  }));
};

export const getGroupedByKey = (expenses: Expense[], key: keyof Expense) => {
  const groupedData = groupByKey(expenses, key);

  return Object.keys(groupedData).map((key) => ({
    title: key,
    data: groupedData[key],
    amount: getExpenseAmount(groupedData[key]),
  }));
};

export const getCurrentMonthExpenses = (
  expenses: Expense[],
  date: Date = new Date()
) => {
  return expenses.filter((expense) => {
    if (!expense?.date) return false;
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === date.getMonth() &&
      expenseDate.getFullYear() === date.getFullYear()
    );
  });
};
