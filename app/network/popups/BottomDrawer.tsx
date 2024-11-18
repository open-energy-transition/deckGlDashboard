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

  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <div className="absolute left-0 top-10 z-100 p-3">
          <Button variant="outline">
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
        <ScrollArea className="h-full overflow-auto">
          <InstalledCapacityBarChart data={capacityComparisonRef} />
          <InstalledCapacityPieChart data={capacityComparisonRef} />
          <GenerationMixBarChart data={generationComparisonRef} />
          <GenerationMixPieChart data={generationComparisonRef} />
          <TotalDemandBarChart data={demandComparisonRef} />
          <CountryCapacityPie installedCapacities={installedCapacities} />
          <div className="flex flex-wrap justify-around items-center pt-4 pb-4">
            <div className="scale-100"></div>
            <div className="scale-100">
              <PieDonut withoutCard={true} />
            </div>
            <div className="scale-100">
              <BarChartSimple />
            </div>
            <div className="scale-100">
              <PieDonut withoutCard={true} />
            </div>
            <div className="scale-100">
              <PieDonut withoutCard={true} />
            </div>
            <div className="scale-100"></div>
          </div>

          <LongBar />
          <DrawerFooter>
            <DrawerClose>
              <Button>CLOSE</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer;
