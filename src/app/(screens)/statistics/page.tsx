"use client";

import MonthSelector from "@/components/common/month-selector";
import { useState } from "react";
import CategoryStats from "./components/category-stats";
import PaidByStats from "./components/paid-by-stats";
import PaidForStats from "./components/paid-for-stats";

import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { getCurrentMonthExpenses } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Statistics() {
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
      <MonthSelector date={currentDate} changeMonth={changeMonth} />
      <CategoryStats expenses={visibleExpenses} />
      <PaidByStats expenses={visibleExpenses} />
      <PaidForStats expenses={visibleExpenses} />
    </div>
  );
}
