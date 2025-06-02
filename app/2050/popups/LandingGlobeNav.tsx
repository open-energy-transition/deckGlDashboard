"use client";

import { Moon, Sun, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Button } from "@/components/ui/button";
import GenerationMixBottomDrawer from "./GenerationmixDrawer";
import SystemCostDrawer from "./SystemCostDrawer";
import CapacityComparisionDrawer from "./CapacityComparisionDrawer";
import CO2EmissionsDrawer from "./CO2EmissionsDrawer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DataItem {
  carrier: string;
  co2_emission: string;
}

interface DrawerData {
  electricityPrice: number;
}

type Props = {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainPageNav = ({ open, setIsOpen }: Props) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DrawerData>({
    electricityPrice: 0,
  });

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        electricityPrice: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/electricity_prices/${selectedCountry}/2021`),
      ]);

      responses.forEach((res, index) => {});

      const [electricityPricesData] = await Promise.all(
        responses.map((r) => r.json()),
      );

      setData({
        electricityPrice:
          parseFloat(electricityPricesData.data?.[0]?.electricity_price) || 0,
      });
    } catch (error) {
      setData({
        electricityPrice: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-background shadow-md hover:bg-accent hover:text-accent-foreground transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-1/2"
        }`}
        onClick={() => setIsOpen(!open)}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <Sheet modal={false} open={true}>
        <SheetContent
          side="left"
          className={`w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50 ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200`}
        >
          <SheetHeader className="relative">
            <SheetClose
              className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <SheetTitle className="text-4xl">2050</SheetTitle>
          </SheetHeader>
          <CountryDropdown defaultValue={selectedCountry} />
          <p>
            See detailed comparison between the latest data and a future net
            zero scenario.
          </p>
          <SystemCostDrawer
            selectedCountry={selectedCountry}
            isParentOpen={open}
            setIsParentOpen={setIsOpen}
          />
          <CapacityComparisionDrawer
            selectedCountry={selectedCountry}
            isParentOpen={open}
            setIsParentOpen={setIsOpen}
          />
          <GenerationMixBottomDrawer
            selectedCountry={selectedCountry}
            isParentOpen={open}
            setIsParentOpen={setIsOpen}
          />
          <CO2EmissionsDrawer
            selectedCountry={selectedCountry}
            isParentOpen={open}
            setIsParentOpen={setIsOpen}
          />
          <div className="flex items-center space-x-2 pt-4 border-t border-border mt-auto">
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MainPageNav;
