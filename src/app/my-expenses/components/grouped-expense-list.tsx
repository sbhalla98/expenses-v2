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
  groupKey: string;
}> = ({ groupedExpenses }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {groupedExpenses.length > 0 ? (
        groupedExpenses.map((group) => (
          <div key={group.title}>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {group.title} {getAmountLabel(group.amount)}
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <ExpenseList expenses={group.data} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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
