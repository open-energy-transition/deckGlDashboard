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
import useSWR from "swr";
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";
import { Generation_info } from "@/utilities/TooltipInfo/ExplainerText/GenerationMix";
import ChartInfoTooltip from "@/utilities/TooltipInfo/HoverComponents/ChartInfoTooltip";
import { CircleFlag } from "react-circle-flags";

type Props = {
  selectedCountry: string;
  isParentOpen: boolean;
  setIsParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GenerationMixBottomDrawer = ({
  selectedCountry,
  isParentOpen,
  setIsParentOpen,
}: Props) => {
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

  useEffect(() => {
    if (open) {
      setIsParentOpen(false);
    } else {
      setIsParentOpen(true);
    }
  }, [open]);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(!open)}>
          {Generation_info.full_name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center mt-3">
          <DrawerHeader className="w-full flex items-center gap-2">
            <CircleFlag
              countryCode={selectedCountry.toLowerCase()}
              height={30}
              className="aspect-square h-20 mr-2"
            />
            <div>
              <DrawerTitle className="text-4xl">
                {Generation_info.full_name} Comparision{" "}
                <ChartInfoTooltip
                  tooltipInfo={Generation_info}
                  className="w-6 h-6"
                />
              </DrawerTitle>
              <DrawerDescription className="text-base">
                {Generation_info.comparison} {selectedCountry}
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="flex flex-col flex-wrap gap-8 justify-center align-middle items-center w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 border-r-2 mx-auto">
            <h2 className="w-full text-3xl font-semibold text-card-foreground text-center">
              Current (2021)
            </h2>
            <GenerationMixGeneral data={generationComparisonState2021} />
          </div>
          <div className="flex flex-col flex-wrap gap-8 justify-center align-middle items-center w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 border-r-2 mx-auto">
            <h2 className="w-full text-3xl font-semibold text-card-foreground text-center">
              Net-Zero Target (2050)
            </h2>
            <GenerationMixGeneral data={generationComparisonState2050} />
          </div>
          <DrawerFooter className="w-full border-t">
            <DrawerClose>
              <Button className="w-[80%]">Close Comparison</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default GenerationMixBottomDrawer;
