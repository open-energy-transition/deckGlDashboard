"use client";
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

import React from "react";
import { LongBar } from "@/components/Charts/LongBar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChartRadial } from "@/components/Charts/ChartRadial";
import PieDonut from "@/components/Charts/PieDonut";
import BarChartSimple from "@/components/Charts/BarChartSimple";
import { Card } from "@/components/ui/card";
import FilledAreaChart from "@/components/Charts/FilledAreaChart";

const BottomDrawer = () => {
  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <div className="absolute right-0 top-0 z-100 p-3">
          <Button variant="outline">Show Network Statics</Button>
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
          <FilledAreaChart />
          <div className="flex flex-wrap justify-around items-center pt-4 pb-4">
            <div className="scale-100">
              <ChartRadial />
            </div>
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
            <div className="scale-100">
              <PieDonut withoutCard={true} />
            </div>
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
