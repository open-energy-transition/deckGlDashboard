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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { GenerationMixPieChart } from "@/components/Charts/GenerationMixPieChart";
import { InstalledCapacityPieChart } from "@/components/Charts/InstalledCapacityPieChart";
import useSWR from 'swr';
import { useTheme } from "next-themes";
import { InstalledCapacityBarChartStacked } from "@/components/Charts/InstalledCapacityBarChartstacked";
import { GenerationMixBarChartStacked } from "@/components/Charts/GenerationMixBarChartStacked";

type Props = {
  selectedCountry: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BottomDrawer = ({ selectedCountry }: Props) => {
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

  const [open, setOpen] = React.useState(false);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(!open)}>
          Show Statistics for country : {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="overflow-y-scroll flex flex-wrap justify-center gap-6 mt-3">
          <DrawerHeader className="w-full pb-2">
            <DrawerTitle className="text-4xl">Network Statistics</DrawerTitle>
            <DrawerDescription className="">
              View all country level charts
            </DrawerDescription>
          </DrawerHeader>
          <InstalledCapacityBarChartStacked data={capacityComparisonRef} />
          <InstalledCapacityPieChart data={capacityComparisonRef} />
          <GenerationMixPieChart data={generationComparisonRef} />
          <GenerationMixBarChartStacked data={generationComparisonRef} />
          <DrawerFooter className="w-full border-t">
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
