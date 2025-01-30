import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import CapacityComparisionDrawer from "./CapacityComparisionDrawer";
import SystemCostDrawer from "./SystemCostDrawer";
import GenerationMixBottomDrawer from "./BottomDrawer";

interface DrawerData {
  electricityPrice2050: number;
  investmentPerCO2: number;
  electricityPrice2021: number;
}

const ElectricityPriceComponent = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DrawerData>({
    electricityPrice2050: 0,
    investmentPerCO2: 0,
    electricityPrice2021: 0,
  });

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        electricityPrice2050: 0,
        investmentPerCO2: 0,
        electricityPrice2021: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/electricity_prices/${selectedCountry}/2050`),
        fetch(`/api/investment_per_co2_reduced/${selectedCountry}/2050`),
        fetch(`/api/electricity_prices/${selectedCountry}/2021`),
      ]);

      const failedResponses = responses.filter((r) => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error("One or more API calls failed");
      }

      const [
        electricityPricesData2050,
        investmentPerCO2Data,
        electricityPriceData2021,
      ] = await Promise.all(responses.map((r) => r.json()));

      const processedData: DrawerData = {
        electricityPrice2050:
          parseFloat(electricityPricesData2050.data?.[0]?.electricity_price) ||
          0,
        investmentPerCO2:
          parseFloat(
            investmentPerCO2Data.data?.[0]?.investment_per_co2_reduced
          ) || 0,
        electricityPrice2021:
          parseFloat(electricityPriceData2021.data?.[0]?.electricity_price) ||
          0,
      };

      setData(processedData);
    } catch (error) {
      setData({
        electricityPrice2050: 0,
        investmentPerCO2: 0,
        electricityPrice2021: 0,
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
    <Card className="absolute bottom-12 h-[14vh] w-[35vw] z-40 left-0 right-0 mx-auto text-accent-foreground bg-background text-center">
      <div className="w-full h-full grid grid-cols-10">
        <div className="col-span-3 px-2 flex flex-col justify-center my-5">
          <p className="text-2xl  font-bold tracking-tight">
            {data.electricityPrice2021.toFixed(2)}{" "}
            <span className="text-lg font-normal ml-2">€/MWh</span>
          </p>
          <h1 className="text-2xl font-bold">2021</h1>
        </div>
        <div className="col-span-4 border-x-2 px-3 flex flex-col justify-center my-5">
          <p className="text-2xl font-bold tracking-tight">
            {data.investmentPerCO2.toFixed(2)}{" "}
            <span className="text-lg font-normal ml-2">€/tCO2</span>
          </p>
          <h1 className="text-2xl font-bold">Investment Required</h1>
        </div>
        <div className="col-span-3 px-2 flex flex-col justify-center my-5">
          <p className="text-2xl font-bold tracking-tight">
            {data.electricityPrice2050.toFixed(2)}{" "}
            <span className="text-lg font-normal ml-2">€/MWh</span>
          </p>
          <h1 className="text-2xl font-bold">2050</h1>
        </div>
      </div>
    </Card>
  );
};

export default ElectricityPriceComponent;
