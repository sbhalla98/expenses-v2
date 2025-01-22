"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { PERSONS } from "@/lib/constants";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import { Expense } from "@/store/use-config-store";

type PaidForStatsProps = {
  expenses: Expense[];
};

export default function PaidForStats({ expenses }: PaidForStatsProps) {
  const processExpenses = () => {
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
  const processExpensesResult = processExpenses();

  const groupedData = getGroupedByKey(processExpensesResult, "paidFor");
  const sortedGroupedData = groupedData.sort(
    (a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data),
  );

  return <GroupedExpenseList groupedExpenses={sortedGroupedData} />;
}
