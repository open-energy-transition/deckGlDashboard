"use client";
import React, { useEffect, useState, useRef } from "react";
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
import { CircleFlag } from "react-circle-flags";
import { Card } from "@/components/ui/card";
import { Co2EmmisionsPie } from "@/components/Charts/Co2EmmisionsPie";

interface DataItem {
  carrier: string;
  co2_emission: string;
}

type Props = {
  selectedCountry: string;
  isParentOpen: boolean;
  setIsParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CO2EmissionsDrawer = ({
  selectedCountry,
  isParentOpen,
  setIsParentOpen,
}: Props) => {
  const { data: co2EmissionsData } = useSWR(
    `/api/co2_emissions/${selectedCountry}/2021`,
    fetcher,
    { suspense: false },
  );

  const [co2Emissions, setCo2Emissions] = useState<DataItem[]>([]);

  useEffect(() => {
    if (co2EmissionsData?.data) {
      setCo2Emissions(co2EmissionsData.data);
    }
  }, [co2EmissionsData]);

  const [open, setOpen] = React.useState(false);

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
        <Button
          className="w-full bg-destructive dark:bg-secondary text-primary text-[1rem] hover:text-foreground dark:hover:bg-background dark:text-card-foreground"
          onClick={() => setOpen(!open)}
        >
          CO2 Emissions
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
              <DrawerTitle className="text-4xl">CO2 Emissions data</DrawerTitle>
              <DrawerDescription className="text-base">
                It is taken from the year 2021 and used as an input for the
                model.
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="flex flex-col flex-wrap gap-8 justify-center align-middle items-center w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 border-r-2 mx-auto">
            <Card className="p-6 space-y-4">
              <h3 className="text-2xl font-bold">
                <CircleFlag
                  countryCode={selectedCountry.toLowerCase()}
                  height={30}
                  className="aspect-square h-6 inline mr-2 -translate-y-1"
                />
                CO2 Emissions (2021)
              </h3>

              <p className="text-2xl font-semibold tracking-tight">
                {(
                  co2Emissions?.reduce(
                    (acc, curr) => acc + (Number(curr.co2_emission) || 0),
                    0,
                  ) / 1e6
                ).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                <span className="text-lg font-normal ml-2">million tCO2</span>
              </p>

              <Co2EmmisionsPie data={co2Emissions} costField="co2_emission" />
            </Card>
          </div>
          <div className="flex flex-col flex-wrap gap-8 justify-center align-middle items-center w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 border-r-2 mx-auto">
            <h2 className="w-full text-3xl font-semibold text-card-foreground text-center"></h2>
          </div>
          <DrawerFooter className="w-full border-t">
            <DrawerClose>
              <Button className="w-[80%]">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default CO2EmissionsDrawer;
