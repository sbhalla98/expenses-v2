"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERSONS } from "@/lib/constants";
import { Expense } from "@/lib/types";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import CategoryChart from "./category-chart";

type PaidByStatsProps = {
  expenses: Expense[];
};

export default function PaidByStats({ expenses }: PaidByStatsProps) {
  const configStore = useConfigStore();

  const getTitle = (title: string) => {
    if (title === PERSONS.PERSON1 || title === PERSONS.PERSON2) {
      return configStore[title];
    }
    return title;
  };

  const groupedData = getGroupedByKey(expenses, "paidBy");
  const sortedGroupedData = groupedData
    .sort((a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data))
    .map((group) => ({
      ...group,
      title: getTitle(group.title),
    }));

  const chartData = sortedGroupedData.map((group) => ({
    title: group.title,
    amount: getExpenseAmount(group.data),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spent By Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryChart chartData={chartData} />
        <GroupedExpenseList groupedExpenses={sortedGroupedData} />
      </CardContent>
    </Card>
  );
}
