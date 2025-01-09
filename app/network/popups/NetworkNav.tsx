"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MainControls } from "@/app/sidebyside/MainControls";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { COUNTRY_COORDINATES } from "@/utilities/CountryConfig/Link";
import BottomDrawer from "@/components/BottomDrawer";
import { useNetworkView } from "@/components/network-view-context";
import MapLegend from "@/app/network/components/MapLegend";
import CountrySelectDropDown from "@/components/CountrySelectDropDown";

const NetworkNav = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <Sheet modal={false} open={true}>
      <SheetContent
        side="left"
        className="fixed top-0 left-0 w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
      >
        <SheetTitle>Network Statistics</SheetTitle>
        <SheetDescription>
          select a country and view all country level charts
        </SheetDescription>

        <div className="flex flex-col gap-4 flex-1">
          <CountrySelectDropDown />

          <div className="flex-1">
            <BottomDrawer selectedCountry={selectedCountry} />
          </div>

          <div className="mt-auto">
            <div className="text-lg font-semibold mb-2">Network Legend</div>
            <div className="grid grid-cols-2 gap-2 bg-secondary/10 rounded-lg p-2">
              <div className="flex flex-col items-start p-2">
                <div className="text-sm font-medium mb-1">
                  Transmission Lines
                </div>
                <MapLegend
                  country={selectedCountry}
                  theme={theme || "light"}
                  type="lines"
                />
              </div>
              <div className="flex flex-col items-start border-l border-border p-2">
                <div className="text-sm font-medium mb-1">Buses</div>
                <MapLegend
                  country={selectedCountry}
                  theme={theme || "light"}
                  type="buses"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-border">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NetworkNav;
