"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import MonthSelector from "@/components/common/month-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import {
  getAmountLabel,
  getCurrentMonthExpenses,
  getExpenseAmount,
  getGroupedByDate,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function MyExpenses() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get("/api/get-expenses");
      return response.data;
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch expenses",
      });
    }
  };
  const { isLoading, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

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
        description={currentExpense}
      />
      <div className="flex-1 overflow-y-auto">
        <GroupedExpenseList groupedExpenses={groupedByDate} />
      </div>
    </div>
  );
}
