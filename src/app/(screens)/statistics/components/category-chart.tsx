"use client";

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

type CategoryChartProps = {
  chartData: {
    title: string;
    amount: number;
  }[];
};

export default function CategoryChart({ chartData }: CategoryChartProps) {
  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
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
        <XAxis dataKey="amount" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="amount"
          layout="vertical"
          fill="var(--color-amount)"
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
  );
}
