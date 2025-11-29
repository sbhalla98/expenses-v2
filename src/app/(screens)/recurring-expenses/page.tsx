"use client";

import RecurringExpenseCard from "@/components/common/recurring-expense-card";
import RecurringExpenseForm from "@/components/common/recurring-expense-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRecurringExpenses } from "@/hooks/use-recurring-expenses";
import { PERSONS } from "@/lib/constants";
import useConfigStore from "@/store/use-config-store";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export default function RecurringExpensesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const configStore = useConfigStore();
  const { data, isLoading } = useRecurringExpenses();

  const getLabel = (label: string) => {
    if (label === PERSONS.PERSON1 || label === PERSONS.PERSON2) {
      return configStore[label];
    }
    return label;
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setIsOpen(true);
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
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Recurring Expenses</h1>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button size="sm" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {editingExpense
                  ? "Edit Recurring Expense"
                  : "Add Recurring Expense"}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto max-h-[80vh] px-4 pb-8">
              <RecurringExpenseForm
                initialValues={
                  editingExpense
                    ? {
                        ...editingExpense,
                        nextPaymentDate: new Date(
                          editingExpense.nextPaymentDate,
                        ),
                      }
                    : undefined
                }
                id={editingExpense?.id}
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="space-y-4">
        {data?.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No recurring expenses found.
          </div>
        ) : (
          data
            ?.sort(
              (a: any, b: any) =>
                new Date(b.nextPaymentDate).getTime() -
                new Date(a.nextPaymentDate).getTime(),
            )
            .map((expense: any, index: number) => (
              <RecurringExpenseCard
                key={expense.id}
                expense={expense}
                index={index}
                onEdit={handleEdit}
              />
            ))
        )}
      </div>
    </div>
  );
}
