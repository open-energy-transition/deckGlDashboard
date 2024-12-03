"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartLegendContent,
  ChartLegend,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: React.MutableRefObject<any>;
}

type ChartDataType = {
  model: string;
  biomass: number;
  coal: number;
  oil: number;
  naturalGas: number;
  hydro: number;
  nuclear: number;
  solar: number;
  wind: number;
  phs: number;
  geothermal: number;
  loadShedding: number;
  totalGeneration: number;
}[];

const carrierMap = {
  Nuclear: "nuclear",
  "Natural gas": "naturalGas",
  Oil: "oil",
  Coal: "coal",
  Biomass: "biomass",
  Hydro: "hydro",
  Solar: "solar",
  Wind: "wind",
  PHS: "phs",
  Geothermal: "geothermal",
  "Load shedding": "loadShedding",
  "Total generation": "totalGeneration",
} as const;

type CarrierKey = (typeof carrierMap)[keyof typeof carrierMap];

const chartConfig = {
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-1))",
  },
  coal: {
    label: "Coal",
    color: "hsl(var(--chart-2))",
  },
  oil: {
    label: "Oil",
    color: "hsl(var(--chart-5))",
  },
  hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-3))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-4))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-5))",
  },
  wind: {
    label: "Wind",
    color: "hsl(var(--chart-1))",
  },
  phs: {
    label: "PHS",
    color: "hsl(var(--chart-2))",
  },
  geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-3))",
  },
  loadShedding: {
    label: "Load Shedding",
    color: "hsl(var(--chart-4))",
  },
  totalGeneration: {
    label: "Total Generation",
    color: "hsl(var(--chart-5))",
  },
  naturalGas: {
    label: "Natural Gas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function GenerationMixBarChartStacked({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data?.current?.data) {
      let dataArray = Array.isArray(data.current.data) ? data.current.data : [];
      console.log("dataArray", dataArray);

      dataArray = dataArray.filter(
        (item: any) =>
          item &&
          item.carrier &&
          item.carrier !== "Total capacity" &&
          item.carrier !== "Geothermal"
      );

      const transformedData: ChartDataType = [
        {
          model: "EMBER",
          biomass: 0,
          coal: 0,
          oil: 0,
          naturalGas: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
          geothermal: 0,
          loadShedding: 0,
          totalGeneration: 0,
        },
        {
          model: "PyPSA",
          biomass: 0,
          coal: 0,
          oil: 0,
          naturalGas: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
          geothermal: 0,
          loadShedding: 0,
          totalGeneration: 0,
        },
        {
          model: "EIA",
          biomass: 0,
          coal: 0,
          oil: 0,
          naturalGas: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
          geothermal: 0,
          loadShedding: 0,
          totalGeneration: 0,
        },
      ];
      for (let i = 0; i < dataArray.length; i++) {
        const item = dataArray[i];
        const carrierName = carrierMap[item.carrier as keyof typeof carrierMap];

        // Skip if the carrier is not in the carrierMap
        if (!carrierName) {
          console.warn(`Unknown carrier: ${item.carrier}`);
          continue;
        }

        // Update the transformedData for each model
        transformedData.forEach((modelObj) => {
          if (modelObj.model === "EMBER") {
            modelObj[carrierName as CarrierKey] = Math.floor(item.ember);
          } else if (modelObj.model === "PyPSA") {
            modelObj[carrierName as CarrierKey] = Math.floor(item.pypsa_model);
          } else if (modelObj.model === "EIA") {
            modelObj[carrierName as CarrierKey] = Math.floor(item.eia);
          }
        });
      }

      setChartData(transformedData);
      console.log("transformedData", transformedData);
    }
  }, [data?.current]);
  if (!data?.current?.data) {
    return (
      <>
        <CardHeader>
          <CardTitle>Generation Mix Comparison</CardTitle>
          <CardDescription>Waiting for data...</CardDescription>
        </CardHeader>
      </>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle>Generation Mix Comparison</CardTitle>
          <CardDescription>No data available to display</CardDescription>
        </CardHeader>
      </>
    );
  }

  return (
    <>
      <Card className="w-[95%] md:w-[80%] xl:w-[60%]">
        <CardHeader>
          <CardTitle>Generation Mix Comparison</CardTitle>
          <CardDescription>EMBER vs PyPSA vs EIA (TWh)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="min-h-[60vh] md:min-h-[10vh] w-full"
            config={chartConfig}
          >
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="model"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                label={{ value: "TWh", angle: -90, position: "insideLeft" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent />}
                className="flex-wrap"
              />
              {Object.keys(chartConfig).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartConfig[key as keyof typeof chartConfig].color}
                  stackId={1}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
