"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import { Expense } from "@/store/use-config-store";

type PaidByStatsProps = {
  expenses: Expense[];
};

export default function PaidByStats({ expenses }: PaidByStatsProps) {
  const groupedData = getGroupedByKey(expenses, "paidBy");
  const sortedGroupedData = groupedData.sort(
    (a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data),
  );

  return <GroupedExpenseList groupedExpenses={sortedGroupedData} />;
}
