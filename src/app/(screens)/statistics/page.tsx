"use client";

import MonthSelector from "@/components/common/month-selector";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/hooks/use-expenses";
import { useToast } from "@/hooks/use-toast";
import {
  getAmountLabel,
  getCurrentMonthExpenses,
  getExpenseAmount,
} from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import CategorySelector from "./components/category-selector";
import CategoryStats from "./components/category-stats";
import FiveDayStats from "./components/five-day-stats";
import PaidByStats from "./components/paid-by-stats";
import PaidForStats from "./components/paid-for-stats";

const STATS_CATEGORIES = [
  { label: "Category Breakup", Component: CategoryStats },
  { label: "Spent By Breakup", Component: PaidByStats },
  { label: "Individual Expense Breakup", Component: PaidForStats },
  { label: "Five Days Breakup", Component: FiveDayStats },
];

export default function Statistics() {
  const { toast } = useToast();
  const { currentMonth: currentDateString, setCurrentMonth } = useConfigStore();
  const currentDate = new Date(currentDateString);

  const [category, setCategory] = useState(0);

  const { label, Component } =
    STATS_CATEGORIES[category] ?? STATS_CATEGORIES[0];

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentMonth(newDate.toISOString());
  };

  const { isLoading, data } = useExpenses();

  const allExpenses = data?.data ?? [];
  const visibleExpenses = getCurrentMonthExpenses(allExpenses, currentDate);
  const currentExpense = getAmountLabel(getExpenseAmount(visibleExpenses));

  const handleCategoryChange = (index: number) => {
    setCategory((prev) => {
      const newIndex = prev + index;
      if (newIndex < 0) return STATS_CATEGORIES.length - 1;
      if (newIndex >= STATS_CATEGORIES.length) return 0;
      return newIndex;
    });
  };

  if (isLoading) {
    return (
      <div className="size-full flex flex-col">
        <div className="p-2">
          <Skeleton className="h-12 " />
        </div>
        <div className="p-2">
          <Skeleton className="h-9" />
        </div>
        <div className="p-2">
          <Skeleton className="h-[210px]" />
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
        description={currentExpense}
      />
      <CategorySelector category={label} setCategory={handleCategoryChange} />
      <div className="flex-1 overflow-y-auto pb-12">
        <Component expenses={visibleExpenses} />
      </div>
    </div>
  );
}
