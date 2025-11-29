"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERSONS } from "@/lib/constants";
import { Expense } from "@/lib/types";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";

type SettlementStatsProps = {
  expenses: Expense[];
};

export default function SettlementStats({ expenses }: SettlementStatsProps) {
  const configStore = useConfigStore();

  const getTitle = (title: string) => {
    if (title === PERSONS.PERSON1 || title === PERSONS.PERSON2) {
      return configStore[title];
    }
    return title;
  };

  // Calculate how much Person 1 paid for Person 2
  let p1PaidForP2 = 0;
  // Calculate how much Person 2 paid for Person 1
  let p2PaidForP1 = 0;

  expenses.forEach((expense) => {
    const amount = Number(expense.amount);

    if (expense.paidBy === PERSONS.PERSON1) {
      if (expense.paidFor === PERSONS.PERSON2) {
        p1PaidForP2 += amount;
      } else if (expense.paidFor === PERSONS.BOTH) {
        p1PaidForP2 += amount / 2;
      }
    } else if (expense.paidBy === PERSONS.PERSON2) {
      if (expense.paidFor === PERSONS.PERSON1) {
        p2PaidForP1 += amount;
      } else if (expense.paidFor === PERSONS.BOTH) {
        p2PaidForP1 += amount / 2;
      }
    }
  });

  const netBalance = p1PaidForP2 - p2PaidForP1;
  const absBalance = Math.abs(netBalance);

  let message = "All settled up!";
  let subMessage = "No one owes anything.";
  let Icon = CheckCircle2;
  let colorClass = "text-green-500";

  if (netBalance > 0) {
    // P1 paid more for P2, so P2 owes P1
    message = `${getTitle(PERSONS.PERSON2)} owes ${getTitle(PERSONS.PERSON1)}`;
    subMessage = getAmountLabel(absBalance);
    Icon = ArrowLeftRight;
    colorClass = "text-red-500";
  } else if (netBalance < 0) {
    // P2 paid more for P1, so P1 owes P2
    message = `${getTitle(PERSONS.PERSON1)} owes ${getTitle(PERSONS.PERSON2)}`;
    subMessage = getAmountLabel(absBalance);
    Icon = ArrowLeftRight;
    colorClass = "text-red-500";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
        <Icon className={`w-16 h-16 ${colorClass}`} />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{message}</h3>
          <p className="text-3xl font-bold tracking-tight">{subMessage}</p>
        </div>
        <div className="w-full pt-6 mt-4 border-t grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">
              {getTitle(PERSONS.PERSON1)} paid for {getTitle(PERSONS.PERSON2)}
            </p>
            <p className="font-medium">{getAmountLabel(p1PaidForP2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              {getTitle(PERSONS.PERSON2)} paid for {getTitle(PERSONS.PERSON1)}
            </p>
            <p className="font-medium">{getAmountLabel(p2PaidForP1)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
