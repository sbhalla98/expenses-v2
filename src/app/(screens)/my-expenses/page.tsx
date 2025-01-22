"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { getGroupedByDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function MyExpenses() {
  const { toast } = useToast();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 p-6">My Expenses</h1>
      <GroupedExpenseList groupedExpenses={getGroupedByDate(data.data)} />
    </div>
  );
}
