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
import { Button } from "../ui/button";

import React from "react";
import { LongBar } from "../Charts/LongBar";

const BottomDrawer = ({ height = "40%" }) => {
  return (
    <Drawer modal={false}>
      <DrawerTrigger className="absolute right-0 top-0 z-100 p-3">
        <Button variant="outline">Show Network Statics</Button>
      </DrawerTrigger>
      <DrawerContent className="top-0 bg-gray-900/80 ">
        <DrawerHeader>
          <DrawerTitle className="text-white text-4xl">
            Network Statics
          </DrawerTitle>
          <DrawerDescription className="text-orange-300">
            veiw all network charts
          </DrawerDescription>
        </DrawerHeader>
        {/* <SimplePie />
        <SimpleBar /> */}
        <LongBar />
        {/* <PieDonut /> */}
        {/* <BarChartSimple /> */}
        <DrawerFooter className="bg-white">
          <DrawerClose>
            <Button>CLOSE</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer;
