import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ChartRadial } from "@/components/Charts/ChartRadial";
import { SideDrawerProps, GeneratorData } from "@/app/types";
import { Card } from "@/components/ui/card";

import { GenerationMixBarChart } from "@/components/Charts/GenerationMixBarChart";
import { InstalledCapacityBarChart } from "@/components/Charts/InstalledCapacityBarChart";
import { TotalDemandBarChart } from "@/components/Charts/TotalDemandBarChart";
import { GenerationMixPieChart } from "@/components/Charts/GenerationMixPieChart";
import { InstalledCapacityPieChart } from "@/components/Charts/InstalledCapacityPieChart";
import useSWR from "swr";

type Props = {
  selectedCountry: string;
  installedCapacities: React.MutableRefObject<any>;
  totalDemand: React.MutableRefObject<any>;
  generationMix: React.MutableRefObject<any>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CountryStatics({ selectedCountry }: Props) {
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
    <Sheet modal={false} open={false}>
      <SheetContent
        side={"left"}
        className="overflow-y-scroll no-scrollbar w-96 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Network Statics</SheetTitle>
          <SheetDescription>view all country level charts</SheetDescription>
        </SheetHeader>
        <InstalledCapacityBarChart data={capacityComparisonRef} />
        <InstalledCapacityPieChart data={capacityComparisonRef} />
        <GenerationMixBarChart data={generationComparisonRef} />
        <GenerationMixPieChart data={generationComparisonRef} />
        <TotalDemandBarChart data={demandComparisonRef} />
      </SheetContent>
    </Sheet>
  );
}
