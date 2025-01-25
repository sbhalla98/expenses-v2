import { PERSONS } from "@/lib/constants";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { useState } from "react";
import { Expense } from "./expense-list";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type ExpenseItemProps = {
  expense: Expense;
};

const snapPoints = [0.8];

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [snap, setSnap] = useState(snapPoints[0]);

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
    <Link href={`edit-expense?id=${expense.id}`}>
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
    </Link>
  );
}
