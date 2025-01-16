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
  Coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  Hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  "Natural gas": {
    label: "Natural gas",
    color: "hsl(var(--chart-CCGT))",
  },
  Nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "Other Fossil": {
    label: "Other Fossil",
    color: "hsl(var(--chart-oil))",
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
  Oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
} satisfies ChartConfig;

export function GenerationMixPieChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [totalGeneration, setTotalGeneration] = useState<number>(0);

  useEffect(() => {
    if (data?.current?.data) {
      const dataArray = Array.isArray(data.current.data)
        ? data.current.data
        : [];

      const totalItem = dataArray.find(
        (item: DataItem) => item.carrier === "Total generation"
      );
      const total = Number(totalItem?.pypsa_model?.toFixed(2) || 0);
      setTotalGeneration(total);

      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item && item.carrier && item.carrier !== "Total generation"
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
      <Card className="w-[95%] px-0 sm:px-24 md:px-0 md:w-[47%] xl:w-[28%] 2xl:w-[25%]">
        <CardHeader>
          <CardTitle>Generation Mix</CardTitle>
          <CardDescription>PyPSA Generation by Technology</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-square">
            <PieChart>
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
                            <span className="font-bold">
                              {chartConfig[name as keyof typeof chartConfig]
                                ?.label || name}
                            </span>
                            <span>{`${
                              typeof value === "number"
                                ? value.toFixed(2)
                                : Number(value).toFixed(2)
                            } TWh`}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold">percentage</span>
                            <span>{`${item.payload.percentage.toFixed(
                              1
                            )}%`}</span>
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
                innerRadius={70}
                outerRadius={110}
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
                            {totalGeneration.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            TWh
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent />}
                className="flex-wrap mt-5"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
