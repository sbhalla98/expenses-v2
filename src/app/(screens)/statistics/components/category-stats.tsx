"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
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
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryChart chartData={chartData} />
        <GroupedExpenseList groupedExpenses={sortedGroupedData} />
      </CardContent>
    </Card>
  );
}
