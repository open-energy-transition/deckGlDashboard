"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
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
  carrier: string;
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

export function GenerationMixBarChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data.current?.data) {
      const transformedData = data.current.data.map((item: any) => ({
        carrier: item.carrier,
        pypsa: Number(item.generation_twh.toFixed(2)),
        eia: Number(item.eia_generation_twh.toFixed(2)),
        ember: Number(item.ember_generation_twh.toFixed(2)),
      }));

      setChartData(transformedData);
    }
  }, [data.current]);

  return (
    <>
      <CardHeader>
        <CardTitle>Generation Mix Comparison</CardTitle>
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
              dataKey="carrier"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              label={{ value: "TWh", angle: -90, position: "insideLeft" }}
              // height={50}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="pypsa"
              fill="var(--color-pypsa)"
              radius={4}
              name="PyPSA"
            />
            <Bar dataKey="eia" fill="var(--color-eia)" radius={4} name="EIA" />
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
