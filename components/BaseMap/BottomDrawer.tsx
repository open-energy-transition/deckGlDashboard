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

const BottomDrawer = () => {
  return (
    <Drawer modal={false}>
      <DrawerTrigger className="absolute right-0 top-0 z-100 p-3">
        <Button variant="outline">Show Network Statics</Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-4xl">Network Statics</DrawerTitle>
          <DrawerDescription className="">
            veiw all country level charts
          </DrawerDescription>
        </DrawerHeader>
        <LongBar />
        <DrawerFooter>
          <DrawerClose>
            <Button>CLOSE</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer;
