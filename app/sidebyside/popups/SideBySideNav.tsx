"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MainControls from "../MainControls";
import { Mode } from "./Mode";

interface SideBySideNavProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const SideBySideNav = ({ mode, setMode }: SideBySideNavProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();
  const { setSelectedRenewableType, setSelectedParameter } = useVisualization();

  useEffect(() => {
  }, [pathname]);


  return (
    <Sheet modal={false} open={true}>
      <SheetContent
        side="left"
        className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
      >
        <SheetHeader>
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
  );
};

export default SideBySideNav;
