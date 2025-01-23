"use client";

import { Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import BottomDrawer from "@/components/BottomDrawer";
import MapLegend from "@/app/network/components/MapLegend";
import { CountryDropdown } from "@/components/ui/country-dropdown";

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const NetworkNav = ({ show, setShow }: Props) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();

  useEffect(() => {}, [pathname]);

  return (
    <Sheet modal={false} open={true}>
      <SheetContent
        side="left"
        className={`fixed top-0 left-0 w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute t-0 right-2 h-8 w-8 bg-background cursor-pointer"
          onClick={() => {
            setShow(false);
          }}
        >
          <X className="h-full w-full" />
        </div>
        <SheetHeader>
          <SheetTitle>Network Statistics</SheetTitle>
          <SheetDescription>
            select a country and view all country level charts
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 flex-1">
          <CountryDropdown defaultValue={selectedCountry} />

          <BottomDrawer
            selectedCountry={selectedCountry}
            showparent={show}
            setShowParent={setShow}
          />

          <div className="mt-auto">
            <div className="text-lg font-semibold mb-2">Network Legend</div>
            <div className="grid grid-cols-2 gap-2 bg-primary rounded-lg p-2">
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
