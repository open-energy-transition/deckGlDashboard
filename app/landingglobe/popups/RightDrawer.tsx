"use client";

import { Moon, Sun, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CapacityComparisionDrawer from "./CapacityComparisionDrawer";
import SystemCostDrawer from "./SystemCostDrawer";
import GenerationMixBottomDrawer from "./BottomDrawer";

interface DataItem {
  carrier: string;
  value: number;
}

interface DrawerData {
  electricityPrice: number;
  investmentPerCO2: number;
}

interface DrawerProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

const RightDrawer = ({ open, setIsOpen }: DrawerProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DrawerData>({
    electricityPrice: 0,
    investmentPerCO2: 0,
  });

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        electricityPrice: 0,
        investmentPerCO2: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/electricity_prices/${selectedCountry}/2050`),
      ]);

      // Check if any response is not ok
      const failedResponses = responses.filter((r) => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error("One or more API calls failed");
      }

      const [electricityPricesData, investmentPerCO2Data] = await Promise.all(
        responses.map((r) => r.json())
      );

      const processedData: DrawerData = {
        electricityPrice:
          parseFloat(electricityPricesData.data?.[0]?.electricity_price) || 0,

        investmentPerCO2:
          parseFloat(
            investmentPerCO2Data.data?.[0]?.investment_per_co2_reduced
          ) || 0,
      };

      setData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      setData({
        electricityPrice: 0,
        investmentPerCO2: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!selectedCountry) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-background shadow-md hover:bg-accent hover:text-accent-foreground transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-1/2"}`}
        onClick={() => setIsOpen(!open)}
      >
        {open ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <Sheet modal={false} open={true}>
        <ScrollSyncPane>
          <SheetContent
            ref={contentRef}
            side="right"
            className={`w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50 ${
              open ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-200`}
          >
            <SheetHeader className="relative">
              <SheetClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <SheetTitle>2050 Scenario</SheetTitle>
              <SheetDescription>
                {selectedCountry
                  ? `Analyzing data for ${selectedCountry}`
                  : "Select a country to view data"}
              </SheetDescription>
            </SheetHeader>

            <GenerationMixBottomDrawer selectedCountry={selectedCountry} />
            <SystemCostDrawer selectedCountry={selectedCountry} />
            <CapacityComparisionDrawer selectedCountry={selectedCountry} />

            <Card className="p-4 min-h-[300px] section-emissions">
              <h3 className="font-semibold mb-4">Emissions</h3>

              <div className="text-sm text-muted-foreground text-center mb-4">
                All CO2 emissions are zero in this 2050 scenario
              </div>
              <p className="text-sm font-medium">Investment per CO2 reduced</p>
              <p className="text-2xl font-bold">
                {data.investmentPerCO2.toFixed(2)} €/tCO2
              </p>
            </Card>

            {/* Electricity Prices */}
            <Card className="p-4 min-h-[150px] section-electricity-prices">
              <h3 className="font-semibold mb-4">Electricity Prices</h3>
              <p className="text-sm font-medium">Price</p>
              <p className="text-2xl font-bold">
                {data.electricityPrice.toFixed(2)} €/MWh
              </p>
            </Card>

            <SheetFooter className="mt-auto">
              {selectedCountry && (
                <div className="flex items-center space-x-2 pt-4 border-t border-border w-full">
                  <Switch
                    id="theme"
                    checked={theme === "light"}
                    onCheckedChange={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  />
                  <Label htmlFor="theme">
                    {theme === "light" ? <Moon /> : <Sun />}
                  </Label>
                </div>
              )}
            </SheetFooter>
          </SheetContent>
        </ScrollSyncPane>
      </Sheet>
    </>
  );
};

export default RightDrawer;
