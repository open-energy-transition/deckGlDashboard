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
import ChartInfoTooltip from "@/utilities/TooltipInfo/HoverComponents/ChartInfoTooltip";
import { Installed_capacity_info } from "@/utilities/TooltipInfo/ExplainerText/InstalledCapacity";

interface Props {
  data: any;
  costField: string;
  heading?: string;
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

export function CarrierCapacityGeneralPie({ data, costField, heading }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [totalGeneration, setTotalGeneration] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const dataArray = Array.isArray(data) ? data : [];
      const total = dataArray.reduce((acc: number, item: DataItem) => {
        return acc + (Number(item[costField as keyof DataItem]) || 0);
      }, 0);
      setTotalGeneration(Number(total.toFixed(2)));

      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item &&
            item.carrier &&
            item.carrier !== `Total ${costField}` &&
            Number(item[costField as keyof DataItem] || 0) > 0,
        )
        .map((item: DataItem) => {
          const value = Number(
            Number(item[costField as keyof DataItem]).toFixed(2),
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
      <Card className="w-full md:w-[26rem]">
        <CardHeader>
          <CardTitle className="text-xl">
            {heading || "default heading"}{" "}
            <ChartInfoTooltip
              tooltipInfo={Installed_capacity_info}
              className="w-6 h-6"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={GenerationMixchartConfigSmall}
            className="h-[26rem] md:h-[24rem] w-full md:aspect-square"
          >
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
                              {GenerationMixchartConfigSmall[
                                name as keyof typeof GenerationMixchartConfigSmall
                              ]?.label || name}
                            </span>
                            <span>{`${
                              typeof value === "number"
                                ? value.toFixed(2)
                                : Number(value).toFixed(2)
                            } GW`}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold">percentage</span>
                            <span>{`${item.payload.percentage.toFixed(
                              1,
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
                className="flex-wrap mt-5"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
