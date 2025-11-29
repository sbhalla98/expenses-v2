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

type WeeklyStatsProps = {
  expenses: Expense[];
};

const WEEKS = [
  { label: "Week 1 (1-7)", start: 1, end: 7 },
  { label: "Week 2 (8-14)", start: 8, end: 14 },
  { label: "Week 3 (15-21)", start: 15, end: 21 },
  { label: "Week 4+ (22-end)", start: 22, end: 31 },
];

export default function WeeklyStats({ expenses }: WeeklyStatsProps) {
  const groupedData = WEEKS.map((week) => {
    const weekExpenses = expenses.filter((expense) => {
      const day = new Date(expense.date).getDate();
      return day >= week.start && day <= week.end;
    });

    return {
      title: week.label,
      data: weekExpenses,
      amount: getExpenseAmount(weekExpenses),
    };
  }).filter((group) => group.data.length > 0);

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Weekly Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {groupedData.map((group) => (
            <AccordionItem value={group.title} key={group.title}>
              <AccordionTrigger className="py-2">
                <div className="flex justify-between w-full pr-4">
                  <span className="text-sm">{group.title}</span>
                  <span className="text-sm font-semibold">
                    {getAmountLabel(group.amount)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <PaidForStats expenses={group.data} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
