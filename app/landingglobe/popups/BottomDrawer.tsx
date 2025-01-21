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
import useSWR from "swr";
import { useTheme } from "next-themes";
import { InstalledCapacityBarChartStacked } from "@/components/Charts/InstalledCapacityBarChartstacked";
import { GenerationMixBarChartStacked } from "@/components/Charts/GenerationMixBarChartStacked";
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";

type Props = {
  selectedCountry: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GlobeBottomDrawer = ({ selectedCountry }: Props) => {
  const { data: generationComparisonData2050 } = useSWR(
    `/api/generation_mix/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const { data: generationComparisonData2021 } = useSWR(
    `/api/generation_mix/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const [generationComparisonState2050, setGenerationComparisonState] =
    React.useState<typeof generationComparisonData2050>(null);

  const [generationComparisonState2021, setGenerationComparisonState2021] =
    React.useState<typeof generationComparisonData2021>(null);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (generationComparisonData2050?.data) {
      setGenerationComparisonState(generationComparisonData2050.data);
    }
  }, [generationComparisonData2050]);

  useEffect(() => {
    if (generationComparisonData2021?.data) {
      setGenerationComparisonState2021(generationComparisonData2021.data);
    }
  }, [generationComparisonData2021]);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(!open)}>
          Show Statistics for country : {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center mt-3">
          <DrawerHeader className="w-full pb-2">
            <DrawerTitle className="text-4xl">
              2050 Net Zero Analysis
            </DrawerTitle>
            <DrawerDescription className="">
              compare data for {selectedCountry} from now to net zero carbon
              emissions in 2050
            </DrawerDescription>
          </DrawerHeader>
          <div className="w-[50%] min-h-screen border-t-2 mt-4 border-r-2">
            <h2 className="w-full text-5xl font-semibold text-card-foreground text-center my-5">
              2021
            </h2>
            <GenerationMixGeneral data={generationComparisonState2021} />
          </div>
          <div className="w-[50%] min-h-screen border-t-2 mt-4">
            <h2 className="w-full text-5xl font-semibold text-card-foreground text-center my-5">
              2050
            </h2>
            <GenerationMixGeneral data={generationComparisonState2050} />
          </div>
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

export default GlobeBottomDrawer;
