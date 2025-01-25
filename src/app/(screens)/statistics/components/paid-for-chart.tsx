"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PERSONS } from "@/lib/constants";
import { getGroupedByKey } from "@/lib/utils";
import useConfigStore, { Expense } from "@/store/use-config-store";
import { Bar, BarChart, XAxis } from "recharts";

type PaidForChartProps = {
  expenses: Expense[];
};

export default function PaidForChart({ expenses }: PaidForChartProps) {
  const configStore = useConfigStore();

  const getTitle = (title: string) => {
    if (title === PERSONS.PERSON1 || title === PERSONS.PERSON2) {
      return configStore[title];
    }
    return title;
  };

  const getChartData = (expenses: Expense[]) =>
    getGroupedByKey(expenses, "category").map((group) => {
      const groupedByPaidFor = getGroupedByKey(group.data, "paidFor");
      return {
        category: group.title,
        [PERSONS.PERSON1]: Math.trunc(groupedByPaidFor[0]?.amount ?? 0),
        [PERSONS.PERSON2]: Math.trunc(groupedByPaidFor[1]?.amount ?? 0),
      };
    });

  const chartConfig = {
    [PERSONS.PERSON1]: {
      label: getTitle(PERSONS.PERSON1),
      color: "oklch(.707 .165 254.624)",
    },
    [PERSONS.PERSON2]: {
      label: getTitle(PERSONS.PERSON2),
      color: "oklch(.718 .202 349.761)",
    },
  } satisfies ChartConfig;

  const chartData = getChartData(expenses);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            return value.slice(0, 4);
          }}
        />
        <Bar
          dataKey={PERSONS.PERSON1}
          stackId="a"
          fill={`var(--color-${PERSONS.PERSON1})`}
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey={PERSONS.PERSON2}
          stackId="a"
          fill={`var(--color-${PERSONS.PERSON2})`}
          radius={[4, 4, 0, 0]}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={false}
          defaultIndex={1}
        />
      </BarChart>
    </ChartContainer>
  );
}
