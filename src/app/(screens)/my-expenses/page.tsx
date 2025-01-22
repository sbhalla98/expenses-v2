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
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 p-6">My Expenses</h1>
      <MonthSelector
        changeMonth={changeMonth}
        title="Current Month"
        subTitle={currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      />
      <GroupedExpenseList groupedExpenses={getGroupedByDate(visibleExpenses)} />
    </div>
  );
}
