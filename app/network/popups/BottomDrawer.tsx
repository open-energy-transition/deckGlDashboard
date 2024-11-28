"use client";
import React, { useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { LongBar } from "@/components/Charts/LongBar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChartRadial } from "@/components/Charts/ChartRadial";
import PieDonut from "@/components/Charts/PieDonut";
import BarChartSimple from "@/components/Charts/BarChartSimple";
import { CountryCapacityPie } from "@/components/Charts/CountryCapacityPie";
import { GenerationMixBarChart } from "@/components/Charts/GenerationMixBarChart";
import { InstalledCapacityBarChart } from "@/components/Charts/InstalledCapacityBarChart";
import { TotalDemandBarChart } from "@/components/Charts/TotalDemandBarChart";
import { GenerationMixPieChart } from "@/components/Charts/GenerationMixPieChart";
import { InstalledCapacityPieChart } from "@/components/Charts/InstalledCapacityPieChart";
import useSWR from 'swr';
import { useTheme } from "next-themes";

type Props = {
  selectedCountry: string;
  installedCapacities: React.MutableRefObject<any>;
  totalDemand: React.MutableRefObject<any>;
  generationMix: React.MutableRefObject<any>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BottomDrawer = ({
  selectedCountry,
  installedCapacities,
  totalDemand,
  generationMix,
}: Props) => {
  const { data: capacityComparisonData } = useSWR(
    `/api/capacity_comparison/${selectedCountry}`,
    fetcher
  );

  const { data: generationComparisonData } = useSWR(
    `/api/generation_comparison/${selectedCountry}`,
    fetcher
  );

  const { data: demandComparisonData } = useSWR(
    `/api/demand_comparison/${selectedCountry}`,
    fetcher
  );

  const capacityComparisonRef = useRef(capacityComparisonData);
  const generationComparisonRef = useRef(generationComparisonData);
  const demandComparisonRef = useRef(demandComparisonData);

  useEffect(() => {
    capacityComparisonRef.current = capacityComparisonData;
  }, [capacityComparisonData]);

  useEffect(() => {
    generationComparisonRef.current = generationComparisonData;
  }, [generationComparisonData]);

  useEffect(() => {
    demandComparisonRef.current = demandComparisonData;
  }, [demandComparisonData]);

  const { theme, setTheme } = useTheme();

  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <div className="absolute left-0 top-10 z-100 p-3">
          <Button
            className={`${
              theme === "dark"
                ? "bg-foreground text-background"
                : "bg-foreground text-background"
            }`}
          >
            Show Statics for country : {selectedCountry}
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-4xl">Network Statics</DrawerTitle>
          <DrawerDescription className="">
            view all country level charts
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-scroll flex flex-wrap justify-center mt-8 gap-6">
          <InstalledCapacityBarChart data={capacityComparisonRef} />
          <InstalledCapacityPieChart data={capacityComparisonRef} />
          <GenerationMixPieChart data={generationComparisonRef} />
          <GenerationMixBarChart data={generationComparisonRef} />
          <TotalDemandBarChart data={demandComparisonRef} />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose>
            <Button>CLOSE</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer;
