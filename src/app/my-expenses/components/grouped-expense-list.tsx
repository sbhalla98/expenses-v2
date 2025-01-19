import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAmountLabel, getGroupedByDate } from "@/lib/utils";
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
  expenses: Expense[];
  groupKey: string;
}> = ({ expenses }) => {
  const groupedData = getGroupedByDate(expenses);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense List</h2>
      {expenses.length > 0 ? (
        groupedData.map((group) => (
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
