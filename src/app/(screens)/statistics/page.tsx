"use client";

import MonthSelector from "@/components/common/month-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenses } from "@/hooks/use-expenses";
import {
  getAmountLabel,
  getCurrentMonthExpenses,
  getExpenseAmount,
  getGroupedByKey,
} from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import {
  CalendarDays,
  TrendingUp
} from "lucide-react";
import CategoryStats from "./components/category-stats";
import FiveDayStats from "./components/five-day-stats";
import PaidByStats from "./components/paid-by-stats";
import PaidForStats from "./components/paid-for-stats";
import SettlementStats from "./components/settlement-stats";
import SplitStats from "./components/split-stats";

export default function Statistics() {
  const { currentMonth: currentDateString, setCurrentMonth } = useConfigStore();
  const currentDate = new Date(currentDateString);

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentMonth(newDate.toISOString());
  };

  const { isLoading, data } = useExpenses();

  const allExpenses = data?.data ?? [];
  const visibleExpenses = getCurrentMonthExpenses(allExpenses, currentDate);
  const totalAmount = getExpenseAmount(visibleExpenses);
  const currentExpenseLabel = getAmountLabel(totalAmount);

  // Calculate insights
  const groupedByCategory = getGroupedByKey(visibleExpenses, "category");
  const highestCategory = groupedByCategory.sort(
    (a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data),
  )[0];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const currentDay =
    currentDate.getMonth() === new Date().getMonth()
      ? new Date().getDate()
      : daysInMonth;
  const dailyAverage = totalAmount / (currentDay || 1);

  if (isLoading) {
    return (
      <div className="size-full flex flex-col p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col overflow-hidden bg-background">
      <MonthSelector
        date={currentDate}
        changeMonth={changeMonth}
        onDateChange={(date) => setCurrentMonth(date.toISOString())}
        description={currentExpenseLabel}
      />

      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-sm font-medium">
                Daily Average
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-2xl font-bold">
                {getAmountLabel(dailyAverage)}
              </div>
              <p className="text-xs text-muted-foreground">
                per day for {currentDay} days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-2xl font-bold truncate">
                {highestCategory ? highestCategory.title : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {highestCategory
                  ? getAmountLabel(getExpenseAmount(highestCategory.data))
                  : "No expenses"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed stats */}
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2">
            <TabsTrigger value="category">Cat.</TabsTrigger>
            <TabsTrigger value="paidBy">Who</TabsTrigger>
            <TabsTrigger value="paidFor">For</TabsTrigger>
            <TabsTrigger value="recent">Days</TabsTrigger>
            <TabsTrigger value="settlement">Settle</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="category">
              <CategoryStats expenses={visibleExpenses} />
            </TabsContent>
            <TabsContent value="paidBy">
              <PaidByStats expenses={visibleExpenses} />
            </TabsContent>
            <TabsContent value="paidFor">
              <PaidForStats expenses={visibleExpenses} />
            </TabsContent>
            <TabsContent value="recent">
              <FiveDayStats expenses={visibleExpenses} />
            </TabsContent>
            <TabsContent value="settlement">
              <SettlementStats expenses={visibleExpenses} />
            </TabsContent>
            <TabsContent value="split">
              <SplitStats expenses={visibleExpenses} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
