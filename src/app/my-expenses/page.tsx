"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { sample } from "@/lib/constants";
import { getGroupedByDate } from "@/lib/utils";

export default function MyExpenses() {
  const groupedData = getGroupedByDate(sample);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 p-6">My Expenses</h1>
      <GroupedExpenseList groupedExpenses={groupedData} />
    </div>
  );
}
