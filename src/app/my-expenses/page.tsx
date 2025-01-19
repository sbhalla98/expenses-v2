"use client";

import { getGroupedByDate } from "@/lib/utils";
import GroupedExpenseList from "./components/grouped-expense-list";
import { sample } from "./constants";

export default function MyExpenses() {
  const groupedData = getGroupedByDate(sample);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 p-6">My Expenses</h1>
      <GroupedExpenseList groupedExpenses={groupedData} groupKey="date" />
    </div>
  );
}
