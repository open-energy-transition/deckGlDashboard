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

interface Props {
  data: React.MutableRefObject<any>;
}

interface DataItem {
  carrier: string;
  pypsa_model: number;
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

const chartConfig = {
  Biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  "Fossil fuels": {
    label: "Fossil fuels",
    color: "hsl(var(--chart-coal))",
  },
  Hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  Nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  Solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  Wind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  PHS: {
    label: "PHS",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function InstalledCapacityPieChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [totalCapacity, setTotalCapacity] = useState<number>(0);

  useEffect(() => {
    if (data?.current?.data) {
      const dataArray = Array.isArray(data.current.data)
        ? data.current.data
        : [];

      // Encontrar el total
      const totalItem = dataArray.find(
        (item: DataItem) => item.carrier === "Total capacity"
      );
      const total = Number(totalItem?.pypsa_model?.toFixed(2) || 0);
      setTotalCapacity(total);

      // Transformar datos para el pie chart
      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item &&
            item.carrier &&
            item.carrier !== "Total capacity" &&
            item.carrier !== "Geothermal"
        )
        .map((item: DataItem) => {
          const value = Number(item.pypsa_model?.toFixed(2) || 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return {
            carrier: item.carrier,
            value: value,
            percentage: Number(percentage.toFixed(1)),
            fill:
              chartConfig[item.carrier as keyof typeof chartConfig]?.color ||
              "hsl(var(--chart-1))",
          };
        })
        .filter((item: ChartItem) => item.value > 0);

      setChartData(transformedData);
    }
  }, [data?.current]);

  return (
    <>
      <Card className="w-[95%] px-4 sm:px-24 md:px-0 md:w-[47%] xl:w-[28%] 2xl:w-[25%]">
        <CardHeader>
          <CardTitle>Installed Capacity Mix</CardTitle>
          <CardDescription>
            PyPSA Installed Capacity by Technology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-square">
            <PieChart>
              <ChartTooltip
                // position={{ x: 0, y: 0 }}
                offset={-6}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    className="w-auto"
                    formatter={(value, name, item, index) => {
                      console.log("item", item);
                      return (
                        <>
                          <div
                            className="h-10 w-2.5 shrink-0 rounded-[2px]"
                            style={
                              {
                                backgroundColor: item.payload.payload.fill,
                              } as React.CSSProperties
                            }
                          />
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <span className="font-bold">
                                {chartConfig[name as keyof typeof chartConfig]
                                  ?.label || name}
                              </span>
                              <span>{`${value.toLocaleString()} GW`}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-bold">percentage</span>
                              <span>{`${item.payload.percentage.toFixed(
                                1
                              )}%`}</span>
                            </div>
                          </div>
                        </>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="carrier"
                innerRadius={70}
                outerRadius={110}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCapacity.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            GW
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent />}
                className="flex-wrap"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
