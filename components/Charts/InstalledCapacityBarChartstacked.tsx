"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  model: string;
  biomass: number;
  fossilFuels: number;
  hydro: number;
  nuclear: number;
  solar: number;
  wind: number;
  phs: number;
}[];

const carrierMap = {
  Biomass: "biomass",
  "Fossil fuels": "fossilFuels",
  Hydro: "hydro",
  Nuclear: "nuclear",
  Solar: "solar",
  Wind: "wind",
  PHS: "phs",
} as const;

type CarrierKey = (typeof carrierMap)[keyof typeof carrierMap];

const chartConfig = {
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  fossilFuels: {
    label: "Fossil Fuels",
    color: "hsl(var(--chart-coal))",
  },
  hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  wind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  phs: {
    label: "PHS",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function InstalledCapacityBarChartStacked({ data }: Props) {
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
          fossilFuels: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
        },
        {
          model: "PyPSA",
          biomass: 0,
          fossilFuels: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
        },
        {
          model: "EIA",
          biomass: 0,
          fossilFuels: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
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
      <Card className="w-[95%] md:w-[80%] xl:w-[68%]">
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>EMBER vs PyPSA vs EIA (GW)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[40vh] w-full" config={chartConfig}>
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
                label={{ value: "GW", angle: -90, position: "insideLeft" }}
                type="number"
                domain={[0, "dataMax"]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent className="pb-0 pt-0" />}
                className="flex-wrap pb-0 mt-3"
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
