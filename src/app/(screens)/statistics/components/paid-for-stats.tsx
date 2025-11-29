"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERSONS } from "@/lib/constants";
import { Expense } from "@/lib/types";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import PaidForChart from "./paid-for-chart";

type PaidForStatsProps = {
  expenses: Expense[];
  expandedView?: boolean;
  showChart?: boolean;
};

export default function PaidForStats({
  expenses,
  expandedView = true,
  showChart = true,
}: PaidForStatsProps) {
  const configStore = useConfigStore();

  const getTitle = (title: string) => {
    if (title === PERSONS.PERSON1 || title === PERSONS.PERSON2) {
      return configStore[title];
    }
    return title;
  };

  const processExpenses = (expenses: Expense[]) => {
    const result: Expense[] = [];
    expenses.forEach((expense) => {
      if (expense.paidFor !== PERSONS.BOTH) {
        result.push(expense);
      } else {
        const newExpense1 = {
          ...expense,
          id: `${expense.id}-${PERSONS.PERSON1}`,
          amount: expense.amount / 2,
          paidFor: PERSONS.PERSON1,
        };
        const newExpense2 = {
          ...expense,
          id: `${expense.id}-${PERSONS.PERSON2}`,
          amount: expense.amount / 2,
          paidFor: PERSONS.PERSON2,
        };
        result.push(newExpense1);
        result.push(newExpense2);
      }
    });

    return result;
  };

  const processExpensesResult = processExpenses(expenses);

  const groupedData = getGroupedByKey(processExpensesResult, "paidFor");
  const sortedGroupedData = groupedData
    .sort((a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data))
    .map((group) => ({
      ...group,
      title: getTitle(group.title),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showChart && <PaidForChart expenses={processExpensesResult} />}
        <GroupedExpenseList
          groupedExpenses={sortedGroupedData}
          expandedView={expandedView}
        />
      </CardContent>
    </Card>
  );
}
