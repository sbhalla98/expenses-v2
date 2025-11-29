"use client";

import AddExpenseForm from "@/components/common/add-expense-form";
import DeleteExpenseButton from "@/components/common/delete-expense-button";
import { useExpense } from "@/hooks/use-expense";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const EditExpense = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: expense, isLoading } = useExpense(id);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const initialValues = {
    ...(expense?.data ?? {}),
    date: new Date(expense?.data?.date ?? new Date()),
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Expense</h1>
        {id && (
          <DeleteExpenseButton
            id={id}
            onSuccess={() => {
              router.push("/my-expenses");
            }}
          />
        )}
      </div>

      <div className="flex-1">
        {expense?.data && (
          <AddExpenseForm initialValues={initialValues} id={id} />
        )}
      </div>
    </div>
  );
};

export default function EditExpensePage() {
  return (
    <Suspense>
      <EditExpense />
    </Suspense>
  );
}
