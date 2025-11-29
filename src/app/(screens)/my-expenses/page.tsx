"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import MonthSelector from "@/components/common/month-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/hooks/use-expenses";
import {
  getAmountLabel,
  getCurrentMonthExpenses,
  getExpenseAmount,
  getGroupedByDate,
} from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";

export default function MyExpenses() {
  const { currentMonth: currentDateString, setCurrentMonth } = useConfigStore();
  const currentDate = new Date(currentDateString);

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentMonth(newDate.toISOString());
  };

  const { isLoading, data } = useExpenses();

  const allExpenses = data?.data ?? [];
  const visibleExpenses = getCurrentMonthExpenses(allExpenses, currentDate);
  const groupedByDate = getGroupedByDate(visibleExpenses);
  const currentExpense = getAmountLabel(getExpenseAmount(visibleExpenses));

  if (isLoading) {
    return (
      <div className="size-full flex flex-col">
        <div className="p-2">
          <Skeleton className="h-12 " />
        </div>
        <div className="p-4">
          <Skeleton className="h-4" />
        </div>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div className="mt-2 mx-2" key={index}>
              <Skeleton className="h-[68px] rounded-xl" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      <MonthSelector
        date={currentDate}
        changeMonth={changeMonth}
        onDateChange={(date) => setCurrentMonth(date.toISOString())}
        description={currentExpense}
      />
      <div className="flex-1 overflow-y-auto pb-12">
        <GroupedExpenseList groupedExpenses={groupedByDate} />
      </div>
    </div>
  );
}
