"use client";

import AddExpenseForm from "@/components/common/add-expense-form";
import DeleteExpenseButton from "@/components/common/delete-expense-button";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditExpense() {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchExpense = async () => {
    try {
      const response = await apiClient.get(`/api/get-expense?id=${id}`);
      return response.data;
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch expense",
      });
    }
  };
  const { isLoading, data } = useQuery({
    queryKey: ["expense"],
    queryFn: fetchExpense,
  });

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!id || !data) {
    return <div>Error</div>;
  }

  const initialValues = {
    ...(data?.data ?? {}),
    date: new Date(data?.data?.date ?? new Date()),
  };

  return (
    <div className="size-full flex flex-col overflow-y-auto pb-12">
      <AddExpenseForm initialValues={initialValues} id={id} />
      <DeleteExpenseButton id={id} />
    </div>
  );
}

export default function EditExpensePage() {
  return (
    <Suspense>
      <EditExpense />
    </Suspense>
  );
}
