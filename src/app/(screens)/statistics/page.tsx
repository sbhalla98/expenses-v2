"use client";

import MonthSelector from "@/components/common/month-selector";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { getCurrentMonthExpenses } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import CategorySelector from "./components/category-selector";
import CategoryStats from "./components/category-stats";
import PaidByStats from "./components/paid-by-stats";
import PaidForStats from "./components/paid-for-stats";

const STATS_CATEGORIES = [
  { label: "Category", Component: CategoryStats },
  { label: "Paid By", Component: PaidByStats },
  { label: "Paid For", Component: PaidForStats },
];

export default function Statistics() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [category, setCategory] = useState(0);

  const { label, Component } =
    STATS_CATEGORIES[category] ?? STATS_CATEGORIES[0];

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

  const handleCategoryChange = (index: number) => {
    setCategory((prev) => {
      const newIndex = prev + index;
      if (newIndex < 0) return STATS_CATEGORIES.length - 1;
      if (newIndex >= STATS_CATEGORIES.length) return 0;
      return newIndex;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="size-full flex flex-col">
      <MonthSelector date={currentDate} changeMonth={changeMonth} />
      <CategorySelector category={label} setCategory={handleCategoryChange} />
      <div className="flex-1 max-w-[100vw] overflow-y-auto">
        <Component expenses={visibleExpenses} />
      </div>
    </div>
  );
}
