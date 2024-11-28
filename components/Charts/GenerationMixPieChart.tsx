"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Legend, Label } from "recharts";

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
      
      const totalItem = dataArray.find((item: DataItem) => item.carrier === "Total generation");
      const total = Number(totalItem?.pypsa_model?.toFixed(2) || 0);
      setTotalGeneration(total);

      const transformedData = dataArray
        .filter((item: DataItem) => 
          item && 
          item.carrier && 
          item.carrier !== "Total generation"
        )
        .map((item: DataItem) => {
          const value = Number(item.pypsa_model?.toFixed(2) || 0);
          const percentage = total > 0 ? (value / total * 100) : 0;
          return {
            carrier: item.carrier,
            value: value,
            percentage: Number(percentage.toFixed(1)),
            fill: chartConfig[item.carrier as keyof typeof chartConfig]?.color || "hsl(var(--chart-1))"
          };
        })
        .filter((item: ChartItem) => item.value > 0);

      setChartData(transformedData);
    }
  }, [data?.current]);

  return (
    <>
      <CardHeader>
        <CardTitle>Generation Mix</CardTitle>
        <CardDescription>PyPSA Generation by Technology</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[600px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip 
                content={({ payload }) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-black bg-opacity-90 p-3 rounded shadow text-white">
                        <p className="font-bold text-sm">{data.carrier}</p>
                        <p className="text-sm">{data.value.toFixed(2)} TWh</p>
                        <p className="text-sm">{data.percentage.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="carrier"
                innerRadius={100}
                outerRadius={180}
                label={({ cx, cy, midAngle, outerRadius, percentage }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius * 1.3;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return percentage > 5 ? (
                    <text
                      x={x}
                      y={y}
                      fill="currentColor"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      className="fill-muted-foreground text-sm font-medium"
                    >
                      {`${percentage.toFixed(1)}%`}
                    </text>
                  ) : null;
                }}
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
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </>
  );
}
