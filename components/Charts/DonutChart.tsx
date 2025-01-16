"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DonutChartProps {
  data: Array<{
    carrier: string;
    value: number;
  }>;
  title: string;
  description?: string;
  unit?: string;
}

const chartConfig = {
  CCGT: {
    label: "Combined Cycle Gas Turbine",
    color: "hsl(var(--chart-CCGT))",
  },
  OCGT: {
    label: "Open Cycle Gas Turbine",
    color: "hsl(var(--chart-OCGT))",
  },
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-geothermal))",
  },
  lignite: {
    label: "Lignite",
    color: "hsl(var(--chart-lignite))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "offwind-ac": {
    label: "Offshore Wind AC",
    color: "hsl(var(--chart-offwind-ac))",
  },
  "offwind-dc": {
    label: "Offshore Wind DC",
    color: "hsl(var(--chart-offwind-dc))",
  },
  oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
  onwind: {
    label: "Onshore Wind",
    color: "hsl(var(--chart-onwind))",
  },
  ror: {
    label: "Run of River",
    color: "hsl(var(--chart-ror))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  load: {
    label: "Load",
    color: "hsl(var(--chart-load))",
  },
} as const satisfies ChartConfig

export function DonutChart({ data, title, description, unit = "" }: DonutChartProps) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  const chartData = React.useMemo(() => {
    return data.map(item => ({
      carrier: item.carrier,
      value: item.value,
      fill: chartConfig[item.carrier.toLowerCase() as keyof typeof chartConfig]?.color || "hsl(var(--chart-1))"
    }))
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="carrier"
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    return (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span>{chartConfig[item.carrier.toLowerCase() as keyof typeof chartConfig]?.label || item.carrier}</span>
                        <span className="font-mono">{item.value.toLocaleString()} {unit}</span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="carrier"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {totalValue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={cx}
                        y={Number(cy) + 20}
                        className="fill-muted-foreground text-sm"
                      >
                        {unit}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 