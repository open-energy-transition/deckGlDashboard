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
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";
import useSWR from "swr";
import { CarrierCostGeneral } from "@/components/Charts/CarrierCostPie";
import { CarrierCapacityGeneralPie } from "@/components/Charts/CapacityGlobeChart";

type Props = {
  selectedCountry: string;
  isParentOpen: boolean;
  setIsParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CapacityComparisionDrawer = ({
  selectedCountry,
  isParentOpen,
  setIsParentOpen,
}: Props) => {
  const { data: installedCapacityData2021 } = useSWR(
    `/api/installed_capacity/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const { data: capacityExpansionData2021 } = useSWR(
    `/api/capacity_expansion/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const { data: installedCapacityData2050 } = useSWR(
    `/api/installed_capacity/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const { data: capacityExpansionData2050 } = useSWR(
    `/api/capacity_expansion/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const [installedCapacityState2021, setInstalledCapacityState2021] =
    React.useState<typeof installedCapacityData2021>(null);

  const [capacityExpansionState2021, setCapacityExpansionState2021] =
    React.useState<typeof capacityExpansionData2021>(null);

  const [installedCapacityState2050, setInstalledCapacityState2050] =
    React.useState<typeof installedCapacityData2050>(null);

  const [capacityExpansionState2050, setCapacityExpansionState2050] =
    React.useState<typeof capacityExpansionData2050>(null);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (installedCapacityData2021?.data) {
      setInstalledCapacityState2021(installedCapacityData2021.data);
    }
  }, [installedCapacityData2021]);

  useEffect(() => {
    if (capacityExpansionData2021?.data) {
      setCapacityExpansionState2021(capacityExpansionData2021.data);
    }
  }, [capacityExpansionData2021]);

  useEffect(() => {
    if (installedCapacityData2050?.data) {
      setInstalledCapacityState2050(installedCapacityData2050.data);
    }
  }, [installedCapacityData2050]);

  useEffect(() => {
    if (capacityExpansionData2050?.data) {
      setCapacityExpansionState2050(capacityExpansionData2050.data);
    }
  }, [capacityExpansionData2050]);

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
          Capacity Distribution for {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center align-middle mt-3">
          <DrawerHeader className="w-full pb-2">
            <DrawerTitle className="text-4xl">
              Installed Capacity Analysis
            </DrawerTitle>
            <DrawerDescription className="text-base">
              Comparing installed capacity and expansion requirements between
              current state and net-zero target for {selectedCountry}
            </DrawerDescription>
          </DrawerHeader>
          {/* left 2021 */}
          <div className="flex flex-wrap justify-center items-start w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 lg:h-fit gap-6">
            <h2 className="w-full text-4xl font-semibold text-card-foreground text-center self-start">
              Current Capacity (2021)
            </h2>
            <p className="text-muted-foreground text-center w-full self-start">
              Distribution of currently installed power generation capacity by
              technology
            </p>
            <CarrierCapacityGeneralPie
              data={installedCapacityState2021}
              costField="installed_capacity"
              heading="Total Installed Capacity"
              description="Distribution of currently installed power generation capacity by
              technology"
            />
          </div>
          {/* right 2050 */}
          <div className="flex flex-wrap gap-6 justify-center items-start w-[100%] lg:w-[50%] p-8 border-t-2 border-l-2  mt-4 ">
            <h2 className="w-full text-4xl font-semibold text-card-foreground text-center">
              Net-Zero Target (2050)
            </h2>
            <p className="text-muted-foreground text-center w-full">
              Required capacity distribution and expansion to achieve carbon
              neutrality
            </p>
            <CarrierCapacityGeneralPie
              data={installedCapacityState2050}
              costField="installed_capacity"
              heading="Total Installed Capacity"
              description="Distribution of currently installed power generation capacity by"
            />
            <CarrierCapacityGeneralPie
              data={capacityExpansionState2050}
              costField="capacity_expansion"
              heading="Required Capacity Expansion"
              description="Distribution of power generation capacity expansion requirements by technology"
            />
          </div>
          <DrawerFooter className="w-full border-t">
            <DrawerClose>
              <Button className="w-[80%]">Close Analysis</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default CapacityComparisionDrawer;
