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

import { GenerationMixchartConfig } from "@/utilities/GenerationMixChartConfig";
import ChartInfoTooltip from "@/utilities/TooltipInfo/HoverComponents/ChartInfoTooltip";
import { Generation_info } from "@/utilities/TooltipInfo/ExplainerText/GenerationMix";
import ModelInfoTooltip from "@/utilities/TooltipInfo/HoverComponents/ModelInfoTooltip";
import { PyPSA_info } from "@/utilities/TooltipInfo/ExplainerText/Models/Pypsa";
import ModelTextTooltip from "@/utilities/TooltipInfo/HoverTextTooltip/ModelTextTooltip";

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

//

export function GenerationMixPieChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [totalGeneration, setTotalGeneration] = useState<number>(0);

  useEffect(() => {
    if (data?.current?.data) {
      const dataArray = Array.isArray(data.current.data)
        ? data.current.data
        : [];

      const totalItem = dataArray.find(
        (item: DataItem) => item.carrier === "Total generation",
      );
      const total = Number(totalItem?.pypsa_model?.toFixed(2) || 0);
      setTotalGeneration(total);

      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item && item.carrier && item.carrier !== "Total generation",
        )
        .map((item: DataItem) => {
          const value = Number(item.pypsa_model?.toFixed(2) || 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return {
            carrier: item.carrier,
            value: value,
            percentage: Number(percentage.toFixed(1)),
            fill:
              GenerationMixchartConfig[
                item.carrier as keyof typeof GenerationMixchartConfig
              ]?.color || "hsl(var(--chart-1))",
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
          <CardTitle>
            Generation Mix{" "}
            <ChartInfoTooltip
              tooltipInfo={Generation_info}
              className="h-4 w-4 -translate-y-[1px]"
            />
          </CardTitle>
          <CardDescription>
            <ModelTextTooltip tooltipInfo={PyPSA_info} DisplayText="PyPSA" />{" "}
            Generation by Technology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={GenerationMixchartConfig}
            className="aspect-square"
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
                              {GenerationMixchartConfig[
                                name as keyof typeof GenerationMixchartConfig
                              ]?.label || name}
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
