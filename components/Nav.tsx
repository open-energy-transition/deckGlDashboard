"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PieDonut from "./Charts/PieDonut";
import BarChartSimple from "./Charts/BarChartSimple";
import { useState, useEffect } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Function to handle button clicks
  // const handleButtonClick = (content) => {
  //   setOpen(true);
  //   setModalContent(content);
  //   console.log(true, content); // Log the value you just set
  // };

  const handleButtonClick = (content) => {
    setOpen(true);
    setModalContent(content);
  };

  useEffect(() => {
    console.log("open is now", open);
  }, [open]);

  return (
    <>
      {/* Buttons to Open/Close Modals */}
      <div>
        <Button
          onClick={(e) => {
            handleButtonClick("mainData");
          }}
        >
          Main Data
        </Button>
        <Button
          onClick={(e) => {
            handleButtonClick("line");
          }}
        >
          Line
        </Button>
        <Button
          variant="outline"
          onClick={(e) => {
            handleButtonClick("bus");
          }}
        >
          Bus
        </Button>
      </div>

      {/* Modal */}
      <Sheet modal={false} open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-scroll">
          <SheetHeader className="pb-6">
            <SheetTitle>
              {modalContent === "mainData" && "Main Data"}
              {modalContent === "line" && "Line"}
              {modalContent === "bus" && "Bus"}
            </SheetTitle>
            <SheetDescription>
              {modalContent === "mainData" &&
                "This is the main data modal. Make changes to your data here."}
              {modalContent === "line" &&
                "This is the line modal. Edit your line settings here."}
              {modalContent === "bus" &&
                "This is the bus modal. Update your bus configurations here."}
            </SheetDescription>
          </SheetHeader>
          <div>
            {/* Content for Main Data */}
            <PieDonut />
            <BarChartSimple />
          </div>
          <SheetFooter className="pt-6">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
