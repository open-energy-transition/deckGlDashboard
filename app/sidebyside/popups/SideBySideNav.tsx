"use client";

import { Moon, Sun, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import MainControls from "../MainControls";
import { Mode } from "./Mode";
import { usePathname } from "next/navigation";
import { useVisualization } from "@/components/visualization-context";
import { useCountry } from "@/components/country-context";
import { Button } from "@/components/ui/button";

interface SideBySideNavProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const SideBySideNav = ({ mode, setMode }: SideBySideNavProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();
  const { setSelectedRenewableType, setSelectedParameter } = useVisualization();
  const [open, setOpen] = useState(true);

  React.useEffect(() => {}, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-background shadow-md hover:bg-accent hover:text-accent-foreground transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-1/2"}`}
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      <Sheet modal={false} open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
        >
          <SheetHeader className="relative">
            <SheetClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <SheetTitle>Side by Side View</SheetTitle>
            <SheetDescription>
              Compare different renewable energy sources
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 flex-1">
            <MainControls
              buttonPosition="left"
              close={() => {}}
              onRenewableTypeChange={() => {}}
              onParameterChange={() => {}}
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SideBySideNav;
