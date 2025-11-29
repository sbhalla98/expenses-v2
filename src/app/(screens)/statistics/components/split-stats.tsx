"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { PERSONS } from "@/lib/constants";
import { Expense } from "@/lib/types";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { Cell, Legend, Pie, PieChart } from "recharts";

type SplitStatsProps = {
  expenses: Expense[];
};

export default function SplitStats({ expenses }: SplitStatsProps) {
  const configStore = useConfigStore();

  const getTitle = (title: string) => {
    if (title === PERSONS.PERSON1 || title === PERSONS.PERSON2) {
      return configStore[title];
    }
    return title;
  };

  let sharedAmount = 0;
  let p1PersonalAmount = 0;
  let p2PersonalAmount = 0;

  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    if (expense.paidFor === PERSONS.BOTH) {
      sharedAmount += amount;
    } else if (expense.paidFor === PERSONS.PERSON1) {
      p1PersonalAmount += amount;
    } else if (expense.paidFor === PERSONS.PERSON2) {
      p2PersonalAmount += amount;
    }
  });

  const data = [
    { name: "Shared", value: sharedAmount, color: "hsl(var(--chart-1))" },
    {
      name: getTitle(PERSONS.PERSON1),
      value: p1PersonalAmount,
      color: "hsl(var(--chart-2))",
    },
    {
      name: getTitle(PERSONS.PERSON2),
      value: p2PersonalAmount,
      color: "hsl(var(--chart-3))",
    },
  ].filter((item) => item.value > 0);

  const chartConfig = {
    Shared: {
      label: "Shared",
      color: "hsl(var(--chart-1))",
    },
    [PERSONS.PERSON1]: {
      label: getTitle(PERSONS.PERSON1),
      color: "hsl(var(--chart-2))",
    },
    [PERSONS.PERSON2]: {
      label: getTitle(PERSONS.PERSON2),
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shared vs Individual Split</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => {
                  const item = data.find((d) => d.name === value);
                  return (
                    <span className="text-sm text-muted-foreground ml-2">
                      {value}: {getAmountLabel(item?.value || 0)}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
