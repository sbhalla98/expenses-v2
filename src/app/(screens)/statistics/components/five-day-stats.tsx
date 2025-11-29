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

type FiveDayStatsProps = {
  expenses: Expense[];
};
const SLABS: { [key: number]: { start: number; end: number; label: string } } =
  {
    0: {
      start: 1,
      end: 5,
      label: "1-5",
    },
    1: {
      start: 6,
      end: 10,
      label: "6-10",
    },
    2: {
      start: 11,
      end: 15,
      label: "11-15",
    },
    3: {
      start: 16,
      end: 20,
      label: "16-20",
    },
    4: {
      start: 21,
      end: 25,
      label: "21-25",
    },
    5: {
      start: 26,
      end: 31,
      label: "26-31",
    },
  };

const getSections = (expenses: Expense[]) => {
  const sections: Expense[][] = [[], [], [], [], [], []];
  expenses.forEach((expense) => {
    const date = new Date(expense.date).getDate();
    if (date >= SLABS[0].start && date <= SLABS[0].end) {
      sections[0].push(expense);
    } else if (date >= SLABS[1].start && date <= SLABS[1].end) {
      sections[1].push(expense);
    } else if (date >= SLABS[2].start && date <= SLABS[2].end) {
      sections[2].push(expense);
    } else if (date >= SLABS[3].start && date <= SLABS[3].end) {
      sections[3].push(expense);
    } else if (date >= SLABS[4].start && date <= SLABS[4].end) {
      sections[4].push(expense);
    } else if (date >= SLABS[5].start && date <= SLABS[5].end) {
      sections[5].push(expense);
    }
  });

  return sections
    .filter((section) => section.length > 0)
    .map((section, index) => ({
      title: SLABS[index]?.label,
      data: section,
      amount: getExpenseAmount(section),
    }));
};

export default function FiveDayStats({ expenses }: FiveDayStatsProps) {
  const sections = getSections(expenses);

  // Calculate last 5 days and group expenses by day
  const today = new Date();
  const last5Days: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last5Days.push(d);
  }

  const groupedData = last5Days.map((date) => {
    const dateString = date.toDateString();
    const expensesForDay = expenses.filter(
      (expense) => new Date(expense.date).toDateString() === dateString,
    );
    return {
      title: dateString,
      data: expensesForDay,
      amount: getExpenseAmount(expensesForDay),
    };
  }).filter(group => group.data.length > 0); // Only include days with expenses

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 5 Days Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {groupedData.map((dayGroup) => {
            const dateString = dayGroup.title;

            return (
              <AccordionItem value={dateString} key={dateString}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span>{dateString}</span>
                    <span>
                      {getAmountLabel(dayGroup.amount)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <PaidForStats expenses={dayGroup.data} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
