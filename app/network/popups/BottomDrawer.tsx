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
import { Card } from "@/components/ui/card";
import FilledAreaChart from "@/components/Charts/FilledAreaChart";
import { CountryCapacityComparision } from "@/components/Charts/CountryCapacityComparision";
import { CountryCapacityPie } from "@/components/Charts/CountryCapacityPie";
import { GenerationMixBarChart } from "@/components/Charts/GenerationMixBarChart";
// import { GenerationMixPieChart } from "@/components/Charts/GenerationMixPieChart";
import { InstalledCapacityBarChart } from "@/components/Charts/InstalledCapacityBarChart";
import { TotalDemandBarChart } from "@/components/Charts/TotalDemandBarChart";

type Props = {
  selectedCountry: string;
  installedCapacities: React.MutableRefObject<any>;
  totalDemand: React.MutableRefObject<any>;
  generationMix: React.MutableRefObject<any>;
};

const BottomDrawer = ({
  selectedCountry,
  installedCapacities,
  totalDemand,
  generationMix,
}: Props) => {
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
            veiw all country level charts
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-full overflow-auto">
          <InstalledCapacityBarChart data={installedCapacities} />
          <GenerationMixBarChart data={generationMix} />
          <TotalDemandBarChart data={totalDemand} />
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
