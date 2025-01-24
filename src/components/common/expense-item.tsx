import { PERSONS } from "@/lib/constants";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { useState } from "react";
import AddExpenseForm from "./add-expense-form";
import DeleteExpenseButton from "./delete-expense-button";
import { Expense } from "./expense-list";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Card, CardContent } from "@/components/ui/card";

type ExpenseItemProps = {
  expense: Expense;
};

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const { PERSON1, PERSON2 } = useConfigStore();
  const { category, amount, description, date, paidBy, paidFor } =
    expense ?? {};

  const getPaidByLabel = () => {
    if (paidBy === PERSONS.PERSON1) return `${PERSON1} paid`;
    if (paidBy === PERSONS.PERSON2) return `${PERSON2} paid`;
    return `${paidBy} paid`;
  };
  const paidByLabel = getPaidByLabel();
  const dateLabel = new Date(date)?.toLocaleDateString();

  const getBgColor = () => {
    if (paidFor === PERSONS.PERSON1) return "bg-blue-100";
    if (paidFor === PERSONS.PERSON2) return "bg-pink-100";
    return "bg-green-100";
  };

  if (!expense) {
    return null;
  }

  return (
    <Drawer open={modalOpen} onOpenChange={setModalOpen}>
      <DrawerTrigger asChild>
        <Card className={`${getBgColor()} p-2`}>
          <CardContent className="p-0 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-700">
                {category}
              </span>
              <span className="text-xs text-gray-500">{description}</span>
              <span className="text-xs text-gray-500">{dateLabel}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">{paidByLabel}</span>
              <span className="text-md font-bold text-gray-800">
                {getAmountLabel(amount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80%]">
        <DrawerHeader>
          <DrawerTitle>Edit Expense</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto pb-12">
          <AddExpenseForm
            initialValues={{ ...expense, date: new Date(expense.date) }}
            id={expense.id}
            onSuccess={() => setModalOpen(false)}
          />
          <DeleteExpenseButton
            id={expense.id}
            onSuccess={() => setModalOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
