"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

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

const NavBar = () => {
  const router = useRouter();
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
        className="absolute w-96 flex flex-col overflow-y-auto no-scrollbar p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        <SheetTitle>Network Statistics</SheetTitle>
        <SheetDescription>
          select a country and view all country level charts
        </SheetDescription>

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

        <BottomDrawer selectedCountry={selectedCountry} />

        <div className="relative bottom-0 flex flex-col gap-2">
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
          <Button
            variant={pathname === "/sidebyside" ? "default" : "outline"}
            onClick={() => router.push("/sidebyside")}
          >
            Scenarios
          </Button>

          <div className="flex items-center space-x-2 mt-4">
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
