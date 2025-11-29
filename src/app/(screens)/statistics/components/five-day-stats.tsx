"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { getAmountLabel, getExpenseAmount } from "@/lib/utils";
import PaidForStats from "./paid-for-stats";

type DailyStatsProps = {
  expenses: Expense[];
};

export default function DailyStats({ expenses }: DailyStatsProps) {
  // Group expenses by date
  const groupedData = expenses.reduce((acc, expense) => {
    const dateString = new Date(expense.date).toDateString();
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedData).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Daily Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {sortedDates.map((dateString) => {
            const dayExpenses = groupedData[dateString];
            const amount = getExpenseAmount(dayExpenses);

            return (
              <AccordionItem value={dateString} key={dateString}>
                <AccordionTrigger className="py-2">
                  <div className="flex justify-between w-full pr-4">
                    <span className="text-sm">{dateString}</span>
                    <span className="text-sm font-semibold">
                      {getAmountLabel(amount)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <PaidForStats expenses={dayExpenses} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
