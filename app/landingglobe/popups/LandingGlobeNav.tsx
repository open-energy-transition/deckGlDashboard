"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollSyncPane } from 'react-scroll-sync';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/Charts/DonutChart";
import GlobeBottomDrawer from "./BottomDrawer";

interface DataItem {
  carrier: string;
  value: number;
}

interface DrawerData {
  totalCosts: DataItem[];
  investmentCosts: DataItem[];
  co2Emissions: DataItem[];
  electricityPrice: number;
  capacities: DataItem[];
  generationMix: DataItem[];
  capacityExpansion: DataItem[];
}

const GlobeNav = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DrawerData>({
    totalCosts: [],
    investmentCosts: [],
    co2Emissions: [],
    electricityPrice: 0,
    capacities: [],
    generationMix: [],
    capacityExpansion: [],
  });

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        totalCosts: [],
        investmentCosts: [],
        co2Emissions: [],
        electricityPrice: 0,
        capacities: [],
        generationMix: [],
        capacityExpansion: [],
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/total_costs_by_techs/${selectedCountry}/2021`),
        fetch(`/api/investment_costs_by_techs/${selectedCountry}/2021`),
        fetch(`/api/co2_emissions/${selectedCountry}/2021`),
        fetch(`/api/electricity_prices/${selectedCountry}/2021`),
        fetch(`/api/installed_capacity/${selectedCountry}/2021`),
        fetch(`/api/generation_mix/${selectedCountry}/2021`),
        fetch(`/api/capacity_expansion/${selectedCountry}/2021`),
      ]);

      const [
        totalCostsData,
        investmentCostsData,
        co2EmissionsData,
        electricityPricesData,
        capacitiesData,
        generationMixData,
        capacityExpansionData,
      ] = await Promise.all(responses.map((r) => r.json()));

      setData({
        totalCosts:
          totalCostsData.data?.map((item: any) => ({
            carrier: item.carrier,
            value: parseFloat(item.total_costs) || 0,
          })) || [],
        investmentCosts:
          investmentCostsData.data?.map((item: any) => ({
            carrier: item.carrier,
            value: parseFloat(item.investment_cost) || 0,
          })) || [],
        co2Emissions:
          co2EmissionsData.data?.map((item: any) => ({
            carrier: item.carrier,
            value: parseFloat(item.co2_emission) || 0,
          })) || [],
        electricityPrice:
          parseFloat(electricityPricesData.data?.[0]?.electricity_price) || 0,
        capacities:
          capacitiesData.data?.map((item: any) => ({
            carrier: item.carrier,
            value: parseFloat(item.installed_capacity) || 0,
          })) || [],
        generationMix:
          generationMixData.data?.map((item: any) => ({
            carrier: item.carrier,
            value: parseFloat(item.generation) || 0,
          })) || [],
        capacityExpansion:
          capacityExpansionData.data?.map((item: any) => ({
            carrier: item.carrier,
            value: parseFloat(item.capacity_expansion) || 0,
          })) || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({
        totalCosts: [],
        investmentCosts: [],
        co2Emissions: [],
        electricityPrice: 0,
        capacities: [],
        generationMix: [],
        capacityExpansion: [],
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCarrierColor = (carrier: string): string => {
    const colorMap: { [key: string]: string } = {
      CCGT: "hsl(var(--chart-CCGT))",
      biomass: "hsl(var(--chart-biomass))",
      coal: "hsl(var(--chart-coal))",
      geothermal: "hsl(var(--chart-geothermal))",
      lignite: "hsl(var(--chart-lignite))",
      nuclear: "hsl(var(--chart-nuclear))",
      "offwind-ac": "hsl(var(--chart-offwind-ac))",
      "offwind-dc": "hsl(var(--chart-offwind-dc))",
      oil: "hsl(var(--chart-oil))",
      onwind: "hsl(var(--chart-onwind))",
      ror: "hsl(var(--chart-ror))",
      solar: "hsl(var(--chart-solar))",
      load: "hsl(var(--chart-load))",
    };
    return (
      colorMap[carrier.toLowerCase()] ||
      `hsl(var(--chart-${Math.floor(Math.random() * 5)}))`
    );
  };

  return (
    <Sheet modal={false} open={true}>
      <ScrollSyncPane>
        <SheetContent
          side="left"
          className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
        >
          <SheetHeader>
            <SheetTitle>2021 Scenario</SheetTitle>
            <SheetDescription>
              {selectedCountry
                ? `Analyzing data for ${selectedCountry}`
                : "Select a country to view data"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 flex-1">
            <CountryDropdown defaultValue={selectedCountry} />
            <GlobeBottomDrawer selectedCountry={selectedCountry} />

            <div className="flex-1 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  Loading...
                </div>
              ) : !selectedCountry ? (
                <div className="flex items-center justify-center py-8">
                  Select a country to view data
                </div>
              ) : (
                <>
                  {/* System Costs */}
                  <Card className="p-4 min-h-[400px] section-system-costs">
                    <h3 className="font-semibold mb-4">System Costs</h3>
                    {data.totalCosts.length > 0 ? (
                      <DonutChart
                        data={data.totalCosts.map((item) => ({
                          ...item,
                          fill: getCarrierColor(item.carrier),
                        }))}
                        title="Total System Cost by Carrier"
                        unit="€"
                      />
                    ) : (
                      <div className="text-center py-4">No data available</div>
                    )}
                    <div className="mt-4">
                      {data.investmentCosts.length > 0 ? (
                        <DonutChart
                          data={data.investmentCosts.map((item) => ({
                            ...item,
                            fill: getCarrierColor(item.carrier),
                          }))}
                          title="Investment Cost by Carrier"
                          unit="€"
                        />
                      ) : (
                        <div className="text-center py-4">
                          No data available
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* CO2 Emissions */}
                  <Card className="p-4 min-h-[300px] section-emissions">
                    <h3 className="font-semibold mb-4">Emissions</h3>
                    {data.co2Emissions.length > 0 ? (
                      <DonutChart
                        data={data.co2Emissions.map((item) => ({
                          ...item,
                          fill: getCarrierColor(item.carrier),
                        }))}
                        title="CO2 Emissions by Carrier"
                        unit="tCO2"
                      />
                    ) : (
                      <div className="text-center py-4">No data available</div>
                    )}
                  </Card>

                  {/* Electricity Prices */}
                  <Card className="p-4 min-h-[150px] section-electricity-prices">
                    <h3 className="font-semibold mb-4">Electricity Prices</h3>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-2xl font-bold">
                        {data.electricityPrice.toFixed(2)} €/MWh
                      </p>
                    </div>
                  </Card>

                  {/* Capacity */}
                  <Card className="p-4 min-h-[400px] section-capacity">
                    <h3 className="font-semibold mb-4">Capacity</h3>
                    {data.capacities.length > 0 ? (
                      <DonutChart
                        data={data.capacities.map((item) => ({
                          ...item,
                          fill: getCarrierColor(item.carrier),
                        }))}
                        title="Installed Capacities by Carrier"
                        unit="MW"
                      />
                    ) : (
                      <div className="text-center py-4">No data available</div>
                    )}
                    <div className="mt-4">
                      {data.capacityExpansion.length > 0 ? (
                        data.capacityExpansion.every(
                          (item) => item.value === 0
                        ) ? (
                          <div className="text-sm text-muted-foreground text-center mb-4">
                            No capacity expansion in 2021
                          </div>
                        ) : (
                          <DonutChart
                            data={data.capacityExpansion.map((item) => ({
                              ...item,
                              fill: getCarrierColor(item.carrier),
                            }))}
                            title="Capacity Expansion by Carrier"
                            unit="MW"
                          />
                        )
                      ) : (
                        <div className="text-center py-4">
                          No data available
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Generation Mix */}
                  <Card className="p-4 min-h-[300px] section-generation-mix">
                    <h3 className="font-semibold mb-4">Generation Mix</h3>
                    {data.generationMix.length > 0 ? (
                      <DonutChart
                        data={data.generationMix.map((item) => ({
                          ...item,
                          fill: getCarrierColor(item.carrier),
                        }))}
                        title="Generation Mix by Carrier"
                        unit="MWh"
                      />
                    ) : (
                      <div className="text-center py-4">No data available</div>
                    )}
                  </Card>
                </>
              )}
            </div>

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
      </ScrollSyncPane>
    </Sheet>
  );
};

export default GlobeNav;
