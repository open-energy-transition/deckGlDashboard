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

import { GenerationMixchartConfigSmall } from "@/utilities/GenerationMixChartConfig";

interface Props {
  data: any;
  costField: string;
}

interface DataItem {
  carrier: string;
  pypsa_model: number;
  total_costs: number;
}

type ChartDataType = {
  carrier: string;
  value: number;
  percentage: number;
  fill: string;
}[];

interface ChartItem {
  carrier: string;
  value: number;
  percentage: number;
  fill: string;
}

export function CarrierCapacityGeneralPie({ data, costField }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [totalGeneration, setTotalGeneration] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const dataArray = Array.isArray(data) ? data : [];
      const total = dataArray.reduce((acc: number, item: DataItem) => {
        return acc + ((Number(item[costField as keyof DataItem]) || 0) / 1000);
      }, 0);
      setTotalGeneration(Number(total.toFixed(2)));

      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item && item.carrier && item.carrier !== `Total ${costField}`
        )
        .map((item: DataItem) => {
          const value = Number(
            ((Number(item[costField as keyof DataItem]) || 0) / 1000).toFixed(2)
          );
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return {
            carrier: item.carrier,
            value: value,
            percentage: Number(percentage.toFixed(1)),
            fill:
              GenerationMixchartConfigSmall[
                item.carrier as keyof typeof GenerationMixchartConfigSmall
              ]?.color || "hsl(var(--chart-1))",
          };
        });

      setChartData(transformedData);
    }
  }, [data, costField]);

  return (
    <>
      <Card className="w-[26rem]">
        <CardHeader>
          <CardTitle>Installed Capacity Distribution</CardTitle>
          <CardDescription>
            Analysis of installed capacity distribution and planned expansion by technology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <ChartContainer
              config={GenerationMixchartConfigSmall}
              className="aspect-square"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        className="w-auto"
                        formatter={(value, name, item, index) => (
                          <>
                            <div
                              className="h-10 w-2.5 shrink-0 rounded-[2px]"
                              style={{
                                backgroundColor: item.payload.payload.fill,
                              }}
                            />
                            <div className="flex flex-col gap-1">
                              <div className="flex gap-2">
                                <span className="font-bold">Technology</span>
                                <span>{GenerationMixchartConfigSmall[
                                  name as keyof typeof GenerationMixchartConfigSmall
                                ]?.label || name}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold">Capacity</span>
                                <span>{`${
                                  typeof value === "number"
                                    ? value.toFixed(2)
                                    : Number(value).toFixed(2)
                                } GW`}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold">Share</span>
                                <span>{`${item.payload.percentage.toFixed(1)}%`}</span>
                              </div>
                            </div>
                          </>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="carrier"
                    innerRadius="45%"
                    outerRadius="75%"
                    paddingAngle={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const cy = viewBox.cy || 0;
                          return (
                            <text
                              x={viewBox.cx}
                              y={cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-foreground"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={cy - 12}
                                className="text-2xl font-bold"
                              >
                                {totalGeneration.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={cy + 12}
                                className="text-base"
                              >
                                GW Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="flex-wrap mt-4"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
