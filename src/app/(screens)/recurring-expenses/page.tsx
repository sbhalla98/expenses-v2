"use client";

import RecurringExpenseForm from "@/components/common/recurring-expense-form";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import apiClient from "@/lib/axios";
import { PERSONS } from "@/lib/constants";
import useConfigStore from "@/store/use-config-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function RecurringExpensesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const configStore = useConfigStore();

  const { data, isLoading } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const response = await apiClient.get("/api/recurring-expenses");
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/recurring-expenses?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
    },
  });

  const getLabel = (label: string) => {
    if (label === PERSONS.PERSON1 || label === PERSONS.PERSON2) {
      return configStore[label];
    }
    return label;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 pb-24 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recurring Expenses</h1>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Recurring Expense</DrawerTitle>
            </DrawerHeader>
            <RecurringExpenseForm onSuccess={() => setIsOpen(false)} />
          </DrawerContent>
        </Drawer>
      </div>

      <div className="space-y-4">
        {data?.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No recurring expenses found.
          </div>
        ) : (
          data?.map((expense: any) => (
            <div
              key={expense.id}
              className="flex flex-col gap-2 rounded-lg border p-4 shadow-sm bg-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{expense.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    {expense.frequency} • Next:{" "}
                    {format(new Date(expense.nextPaymentDate), "PPP")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{expense.amount}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {expense.category}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Paid by: {getLabel(expense.paidBy)} • For:{" "}
                  {getLabel(expense.paidFor)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this?")) {
                      deleteMutation.mutate(expense.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
