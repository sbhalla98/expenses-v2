"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import MonthSelector from "@/components/common/month-selector";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { getCurrentMonthExpenses, getGroupedByDate } from "@/lib/utils";
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="size-full flex flex-col">
      <MonthSelector date={currentDate} changeMonth={changeMonth} />
      <div className="flex-1">
        <GroupedExpenseList
          groupedExpenses={getGroupedByDate(visibleExpenses)}
        />
      </div>
    </div>
  );
}
