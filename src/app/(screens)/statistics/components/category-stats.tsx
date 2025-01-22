"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import { Expense } from "@/store/use-config-store";

type CategoryStatsProps = {
  expenses: Expense[];
};

export default function CategoryStats({ expenses }: CategoryStatsProps) {
  const groupedData = getGroupedByKey(expenses, "category");
  const sortedGroupedData = groupedData.sort(
    (a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data),
  );

  return <GroupedExpenseList groupedExpenses={sortedGroupedData} />;
}