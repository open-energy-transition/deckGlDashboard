"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

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
  ChartLegendContent,
  ChartTooltipContent,
  ChartLegend,
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
  ember: {
    label: "EMBER",
    color: "hsl(var(--chart-1))",
  },
  pypsa: {
    label: "PyPSA",
    color: "hsl(var(--chart-2))",
  },
  eia: {
    label: "EIA",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const CARRIER_ORDER = [
  "Biomass",
  "Fossil fuels",
  "Hydro",
  "Nuclear",
  "Solar",
  "Wind",
  "PHS",
];

export function InstalledCapacityBarChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data?.current?.data) {
      const dataArray = Array.isArray(data.current.data)
        ? data.current.data
        : [];

      const transformedData = dataArray
        .filter(
          (item: any) =>
            item &&
            item.carrier &&
            item.carrier !== "Total capacity" &&
            item.carrier !== "Geothermal"
        )
        .map((item: any) => ({
          carrier: item.carrier,
          ember: Number(item.ember?.toFixed(2) || 0),
          pypsa: Number(item.pypsa_model?.toFixed(2) || 0),
          eia: Number(item.eia?.toFixed(2) || 0),
        }))
        .sort((a: { carrier: string }, b: { carrier: string }) => {
          const indexA = CARRIER_ORDER.indexOf(a.carrier);
          const indexB = CARRIER_ORDER.indexOf(b.carrier);
          return indexA - indexB;
        });

      setChartData(transformedData);
    }
  }, [data?.current]);

  if (!data?.current?.data) {
    return (
      <>
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>Waiting for data...</CardDescription>
        </CardHeader>
      </>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>No data available to display</CardDescription>
        </CardHeader>
      </>
    );
  }

  return (
    <>
      <Card className="w-[90%] xl:w-[50%]">
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>EMBER vs PyPSA vs EIA (GW)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                label={{ value: "GW", angle: -90, position: "insideLeft" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* <Legend /> */}
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="ember"
                fill="hsl(var(--chart-1))"
                stackId={1}
                radius={[4, 4, 0, 0]}
                name="EMBER"
              />
              <Bar
                dataKey="pypsa"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
                name="PyPSA"
                stackId={1}
              />
              <Bar
                dataKey="eia"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
                name="EIA"
                stackId={1}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
