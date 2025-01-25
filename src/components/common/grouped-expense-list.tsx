import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAmountLabel } from "@/lib/utils";
import React from "react";
import ExpenseList from "./expense-list";

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paidBy?: string;
  paidFor?: string;
};

const GroupedExpenseList: React.FC<{
  groupedExpenses: {
    title: string;
    amount: number;
    data: Expense[];
  }[];
  expandedView?: boolean;
}> = ({ groupedExpenses, expandedView = true }) => {
  return (
    <div className="flex flex-col">
      {groupedExpenses.length > 0 ? (
        groupedExpenses.map((group) => (
          <article key={group.title}>
            <Accordion
              type="single"
              collapsible
              defaultValue={expandedView ? "item-1" : "none"}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-4 ">
                  <h3 className="text-md font-semibold">
                    {group.title} {getAmountLabel(group.amount)}
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <ExpenseList expenses={group.data} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </article>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No expenses added yet. Start tracking your expenses!
        </p>
      )}
    </div>
  );
};

export default GroupedExpenseList;
