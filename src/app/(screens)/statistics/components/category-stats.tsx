"use client";

import GroupedExpenseList from "@/components/common/grouped-expense-list";
import { getExpenseAmount, getGroupedByKey } from "@/lib/utils";
import { Expense } from "@/store/use-config-store";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

type CategoryStatsProps = {
  expenses: Expense[];
};

export default function CategoryStats({ expenses }: CategoryStatsProps) {
  const groupedData = getGroupedByKey(expenses, "category");
  const sortedGroupedData = groupedData.sort(
    (a, b) => getExpenseAmount(b.data) - getExpenseAmount(a.data),
  );

  const chartData = sortedGroupedData.map((group) => ({
    title: group.title,
    desktop: getExpenseAmount(group.data),
  }));

  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            right: 16,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="title"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="desktop" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="desktop"
            layout="vertical"
            fill="var(--color-desktop)"
            radius={4}
          >
            <LabelList
              dataKey="title"
              position="insideLeft"
              offset={8}
              className="fill-[--color-foreground]"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <GroupedExpenseList groupedExpenses={sortedGroupedData} />
    </>
  );
}
