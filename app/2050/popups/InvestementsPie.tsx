"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Legend, Label } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  GenerationMixchartConfig,
  GenerationMixchartConfigSmall,
} from "@/utilities/GenerationMixChartConfig";

interface Props {
  data: any;
  costField: string;
}

interface DataItem {
  carrier: string;
  pypsa_model: number;
  generation: number;
}

type ChartDataType = {
  carrier: string;
  value: number;
  fill: string;
}[];

interface ChartItem {
  carrier: string;
  value: number;
  percentage: number;
  fill: string;
}

export function InvestmentPie({ data, costField }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data) {
      const dataArray = Array.isArray(data) ? data : [];
      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item &&
            item.carrier &&
            item.carrier !== `Total ${costField}` &&
            Number(item[costField as keyof DataItem]) > 0.1,
        )
        .map((item: DataItem) => {
          const value = Number(
            Number(item[costField as keyof DataItem]).toFixed(2),
          );

          return {
            carrier: item.carrier,
            value: value,
            fill:
              GenerationMixchartConfig[
                item.carrier as keyof typeof GenerationMixchartConfig
              ]?.color || "hsl(var(--chart-1))",
          };
        });

      setChartData(transformedData);
    }
  }, [data, costField]);

  return (
    <ChartContainer
      config={GenerationMixchartConfig}
      className="w-full md:aspect-square translate-y-3"
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="carrier"
          innerRadius={0}
          outerRadius={110}
        ></Pie>
        <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
      </PieChart>
    </ChartContainer>
  );
}
