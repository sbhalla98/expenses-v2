"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAmountLabel, getExpenseAmount } from "@/lib/utils";
import { Expense } from "@/store/use-config-store";
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

  return (
    <div>
      {sections.map((section, index) => (
        <Accordion type="single" collapsible defaultValue="item-1" key={index}>
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-4 ">
              <h3 className="text-md font-semibold">
                {section.title} {getAmountLabel(section.amount)}
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <PaidForStats expenses={section.data} expandedView={false} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
