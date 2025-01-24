"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { PERSONS } from "@/lib/constants";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import useConfigStore, { Expense } from "@/store/use-config-store";

type PaidByStatsProps = {
  expenses: Expense[];
};

export default function PaidByStats({ expenses }: PaidByStatsProps) {
  const configStore = useConfigStore();

  const getTitle = (title: string) => {
    if (title === PERSONS.PERSON1 || title === PERSONS.PERSON2) {
      return configStore[title];
    }
    return title;
  };

  const groupedData = getGroupedByKey(expenses, "paidBy");
  const sortedGroupedData = groupedData
    .sort((a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data))
    .map((group) => ({
      ...group,
      title: getTitle(group.title),
    }));

  return <GroupedExpenseList groupedExpenses={sortedGroupedData} />;
}
