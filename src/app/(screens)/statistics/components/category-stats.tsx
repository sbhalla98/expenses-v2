"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import { Expense } from "@/store/use-config-store";
import CategoryChart from "./category-chart";

type CategoryStatsProps = {
  expenses: Expense[];
};

export default function CategoryStats({ expenses }: CategoryStatsProps) {
  const groupedData = getGroupedByKey(expenses, "category");
  const sortedGroupedData = groupedData.sort(
    (a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data),
  );

  const chartData = sortedGroupedData.map((group) => ({
    title: group.title,
    amount: getExpenseAmount(group.data),
  }));

  return (
    <>
      <CategoryChart chartData={chartData} />
      <GroupedExpenseList groupedExpenses={sortedGroupedData} />
    </>
  );
}
