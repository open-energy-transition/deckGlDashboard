"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome it",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type Props = {
  installedCapacities: React.MutableRefObject<any>;
};

type Data = [
  {
    id: number;
    capacity_gw: number;
    carrier: string;
  }
];

type PieData = Array<{
  id: number;
  capacity: number;
  fill: string;
}> | null;

export function CountryCapacityPie({ installedCapacities }: Props) {
  const [data, setData] = useState<PieData | null>(null);
  const [config, setConfig] = useState<{} | null>(null);

  function prepareChartData(data: Data) {
    const piedata: PieData = [];
    const piechartConfig: ChartConfig = {};

    data.forEach((value, index) => {
      piedata.push({
        id: value.id,
        capacity: value.capacity_gw,
        fill: `var(--color-${value.id})`,
      });
      piechartConfig[value.id] = {
        label: value.carrier,
        color: `hsl(var(--chart-${index}))`,
      };
    });

    setData(piedata);
    setConfig(piechartConfig);
    console.log("data.......", piedata);
    console.log("pie chart...", piechartConfig);

    // return piechart;
  }

  useEffect(() => {
    if (installedCapacities.current) {
      if (installedCapacities.current.data) {
        console.log("installedCapacities", installedCapacities.current.data);

        prepareChartData(installedCapacities.current.data);
      }
    }
  }, [installedCapacities.current]);

  return (
    <>
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config || chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={data || chartData} dataKey="capacity" nameKey="id" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </>
  );
}
