"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { useToast } from "@/hooks/use-toast";
import { sample } from "@/lib/constants";
import { getGroupedByDate } from "@/lib/utils";
import { useEffect } from "react";

export default function MyExpenses() {
  const { toast } = useToast();
  const groupedData = getGroupedByDate(sample);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/get-expenses");
      const data = await response.json();
      console.log(data);
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch expenses",
      });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 p-6">My Expenses</h1>
      <GroupedExpenseList groupedExpenses={groupedData} />
    </div>
  );
}
