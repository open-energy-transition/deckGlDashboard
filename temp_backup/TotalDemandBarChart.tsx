"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: React.MutableRefObject<any>;
}

type ChartDataType = {
  name: string;
  pypsa: number;
  eia: number;
  ember: number;
}[];

const chartConfig = {
  pypsa: {
    label: "PyPSA",
    color: "hsl(var(--chart-1))",
  },
  eia: {
    label: "EIA",
    color: "hsl(var(--chart-2))",
  },
  ember: {
    label: "EMBER",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function TotalDemandBarChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data.current?.data?.[0]) {
      const item = data.current.data[0];
      const transformedData = [
        {
          name: "Total Demand",
          pypsa: Number(item.total_demand_twh?.toFixed(2) || 0),
          eia: Number(item.eia_demand_twh?.toFixed(2) || 0),
          ember: Number(item.ember_demand_twh?.toFixed(2) || 0),
        },
      ];

      setChartData(transformedData);
    }
  }, [data.current]);

  return (
    <>
      <CardHeader>
        <CardTitle>Total Demand Comparison</CardTitle>
        <CardDescription>PyPSA vs EIA vs EMBER (TWh)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[40vh] max-h-[40vh] w-full mx-4"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              label={{ value: "TWh", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="pypsa"
              fill="var(--color-pypsa)"
              radius={4}
              name="PyPSA"
            />
            <Bar 
              dataKey="eia" 
              fill="var(--color-eia)" 
              radius={4} 
              name="EIA" 
            />
            <Bar
              dataKey="ember"
              fill="var(--color-ember)"
              radius={4}
              name="EMBER"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
