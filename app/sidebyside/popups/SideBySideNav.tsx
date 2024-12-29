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

import { useVisualization } from "@/components/visualization-context";
import CountrySelectDropDown from "@/components/CountrySelectDropDown";

import ModePannel from "./Mode";
import { Mode } from "./Mode";

const SideBySideNav = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();
  const { setSelectedRenewableType, setSelectedParameter } = useVisualization();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <Sheet modal={false} open={true}>
      <SheetContent
        side="left"
        className="fixed top-0 left-0 w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
      >
        <SheetTitle>Side By Side Section</SheetTitle>
        <SheetDescription>
          select a country and view all country data in polygons
        </SheetDescription>

        <div className="flex flex-col gap-4 flex-1">
          <CountrySelectDropDown />

          <MainControls
            buttonPosition="right"
            close={() => {}}
            onRenewableTypeChange={setSelectedRenewableType}
            onParameterChange={setSelectedParameter}
          />

          <div className="flex items-center space-x-2 pt-4 border-t border-border/50">
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

        <ModePannel />
      </SheetContent>
    </Sheet>
  );
};

export default SideBySideNav;
