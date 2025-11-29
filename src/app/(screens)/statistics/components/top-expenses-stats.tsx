"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { getAmountLabel } from "@/lib/utils";
import { format } from "date-fns";

type TopExpensesStatsProps = {
  expenses: Expense[];
};

export default function TopExpensesStats({ expenses }: TopExpensesStatsProps) {
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Top 10 Expenses</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {topExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">
                  {expense.description || expense.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(expense.date), "MMM d")} • {expense.category}
                </span>
              </div>
              <span className="font-bold text-sm">
                {getAmountLabel(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
