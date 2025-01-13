"use client";

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

const RightDrawer = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <Sheet modal={false} open={true}>
      <SheetContent
        side="right"
        className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
      >
        <SheetTitle>2050</SheetTitle>
        <SheetDescription>
          select a country and compare country level data between scenarios
        </SheetDescription>
        <SheetFooter className="mt-auto">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RightDrawer;
