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
import { useCountry } from "./country-context";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { COUNTRY_COORDINATES } from "@/app/network/components/Links";
import BottomDrawer from "./BottomDrawer";
import { useVisualization } from "./visualization-context";
import { useNetworkView } from "./network-view-context";
import MapLegend from "@/app/network/components/MapLegend";

const NavBar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();
  const { setSelectedRenewableType, setSelectedParameter } = useVisualization();
  const { networkView, setNetworkView } = useNetworkView();

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
          <Select
            value={selectedCountry}
            onValueChange={(value: keyof typeof COUNTRY_COORDINATES) =>
              setSelectedCountry(value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
              <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>South America</SelectLabel>
                <SelectItem value="BR">Brazil</SelectItem>
                <SelectItem value="CO">Colombia</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Asia</SelectLabel>
                <SelectItem value="IN">India</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Africa</SelectLabel>
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="ZA">South Africa</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Oceania</SelectLabel>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Navigation</div>
            <Button
              variant={pathname === "/" ? "default" : "outline"}
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant={pathname === "/network" ? "default" : "outline"}
              onClick={() => router.push("/network")}
            >
              Validation
            </Button>
            {pathname === "/network" && (
              <Button
                variant="default"
                onClick={() => setNetworkView(!networkView)}
                className="mb-2"
              >
                {networkView ? "Country View" : "Network View"}
              </Button>
            )}
            <Button
              variant={pathname === "/sidebyside" ? "default" : "outline"}
              onClick={() => router.push("/sidebyside")}
            >
              Scenarios
            </Button>
          </div>

          {pathname === "/sidebyside" && (
            <MainControls
              buttonPosition="right"
              close={() => {}}
              onRenewableTypeChange={setSelectedRenewableType}
              onParameterChange={setSelectedParameter}
            />
          )}

          <div className="flex-1">
            <BottomDrawer selectedCountry={selectedCountry} />
          </div>

          {pathname === "/network" && networkView && (
            <div className="mt-auto">
              <div className="text-lg font-semibold mb-2">Network Legend</div>
              <div className="grid grid-cols-2 gap-2 bg-secondary/10 rounded-lg p-2">
                <div className="flex flex-col items-start p-2">
                  <div className="text-sm font-medium mb-1">Transmission Lines</div>
                  <MapLegend 
                    country={selectedCountry} 
                    theme={theme || "light"}
                    type="lines"
                  />
                </div>
                <div className="flex flex-col items-start border-l border-border/50 p-2">
                  <div className="text-sm font-medium mb-1">Buses</div>
                  <MapLegend 
                    country={selectedCountry} 
                    theme={theme || "light"}
                    type="buses"
                  />
                </div>
              </div>
            </div>
          )}

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
      </SheetContent>
    </Sheet>
  );
};

export default NavBar;
