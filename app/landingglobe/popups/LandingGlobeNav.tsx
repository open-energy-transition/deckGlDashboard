"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ScrollSyncPane } from 'react-scroll-sync';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/Charts/DonutChart";
import { PieChartWithLabels } from "@/components/Charts/PieChartWithLabels";
import CountrySelectDropDown from "@/components/CountrySelectDropDown";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalCosts: [] as DataItem[],
    investmentCosts: [] as DataItem[],
    co2Emissions: [] as DataItem[],
    electricityPrice: 0,
    capacities: [] as DataItem[],
    generationMix: [] as DataItem[],
    capacityExpansion: [] as DataItem[],
  });

  useSyncedScroll(contentRef, "scenarios-scroll");

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        totalCosts: [],
        investmentCosts: [],
        co2Emissions: [],
        electricityPrice: 0,
        capacities: [],
        generationMix: [],
        capacityExpansion: []
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
        fetch(`/api/capacity_expansion/${selectedCountry}/2021`)
      ]);

      // Log responses for debugging
      responses.forEach((res, index) => {
      });

      const [
        totalCostsData,
        investmentCostsData,
        co2EmissionsData,
        electricityPricesData,
        capacitiesData,
        generationMixData,
        capacityExpansionData
      ] = await Promise.all(responses.map(r => r.json()));

      console.log('Raw data 2021:', {
        totalCosts: totalCostsData,
        investmentCosts: investmentCostsData,
        co2Emissions: co2EmissionsData,
        electricityPrices: electricityPricesData,
        capacities: capacitiesData,
        generationMix: generationMixData,
        capacityExpansion: capacityExpansionData
      });

      const processedCapacityExpansion = capacityExpansionData.data?.map((item: any) => ({
        carrier: item.carrier,
        value: parseFloat(item.capacity_expansion) || 0
      })) || [];

      console.log('Processed capacity expansion data:', {
        raw: capacityExpansionData,
        processed: processedCapacityExpansion
      });

      setData({
        totalCosts: totalCostsData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.total_costs) || 0
        })) || [],
        investmentCosts: investmentCostsData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.investment_cost) || 0
        })) || [],
        co2Emissions: co2EmissionsData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.co2_emission) || 0
        })) || [],
        electricityPrice: parseFloat(electricityPricesData.data?.[0]?.electricity_price) || 0,
        capacities: capacitiesData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.installed_capacity) || 0
        })) || [],
        generationMix: generationMixData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.generation) || 0
        })) || [],
        capacityExpansion: processedCapacityExpansion
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        totalCosts: [],
        investmentCosts: [],
        co2Emissions: [],
        electricityPrice: 0,
        capacities: [],
        generationMix: [],
        capacityExpansion: []
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry) {
      fetchData();
    }
  }, [fetchData, selectedCountry]);

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
      load: "hsl(var(--chart-load))"
    };
    return colorMap[carrier.toLowerCase()] || `hsl(var(--chart-${Math.floor(Math.random() * 5)}))`;
  };

  return (
    <Sheet modal={false} open={true}>
      <ScrollSyncPane>
        <SheetContent
          ref={contentRef}
          side="left"
          className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
        >
          <SheetHeader>
            <SheetTitle>2021 Scenario</SheetTitle>
            <SheetDescription>
              {selectedCountry ? `Analyzing data for ${selectedCountry}` : 'Select a country to view data'}
            </SheetDescription>
          </SheetHeader>

          <div className="mb-4">
            <CountrySelectDropDown />
          </div>

          <div className="flex-1 space-y-4 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">Loading...</div>
            ) : !selectedCountry ? (
              <div className="flex items-center justify-center py-8">Select a country to view data</div>
            ) : (
              <>
                {/* System Costs */}
                <Card className="p-4 min-h-[400px] section-system-costs">
                  <h3 className="font-semibold mb-4">System Costs</h3>
                  {data.totalCosts.length > 0 ? (
                    <DonutChart
                      data={data.totalCosts.map(item => ({
                        ...item,
                        fill: getCarrierColor(item.carrier)
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
                        data={data.investmentCosts.map(item => ({
                          ...item,
                          fill: getCarrierColor(item.carrier)
                        }))}
                        title="Investment Cost by Carrier"
                        unit="€"
                      />
                    ) : (
                      <div className="text-center py-4">No data available</div>
                    )}
                  </div>
                </Card>

                {/* CO2 Emissions */}
                <Card className="p-4 min-h-[300px] section-emissions">
                  <h3 className="font-semibold mb-4">Emissions</h3>
                  {data.co2Emissions.length > 0 ? (
                    <DonutChart
                      data={data.co2Emissions.map(item => ({
                        ...item,
                        fill: getCarrierColor(item.carrier)
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
                    <p className="text-2xl font-bold">{data.electricityPrice.toFixed(2)} €/MWh</p>
                  </div>
                </Card>

                {/* Capacity */}
                <Card className="p-4 min-h-[400px] section-capacity">
                  <h3 className="font-semibold mb-4">Capacity</h3>
                  {data.capacities.length > 0 ? (
                    <DonutChart
                      data={data.capacities.map(item => ({
                        ...item,
                        fill: getCarrierColor(item.carrier)
                      }))}
                      title="Installed Capacities by Carrier"
                      unit="MW"
                    />
                  ) : (
                    <div className="text-center py-4">No data available</div>
                  )}
                  <div className="mt-4">
                    {data.capacityExpansion.length > 0 ? (
                      data.capacityExpansion.every(item => item.value === 0) ? (
                        <div className="text-sm text-muted-foreground text-center mb-4">
                          No capacity expansion in 2021
                        </div>
                      ) : (
                        <DonutChart
                          data={data.capacityExpansion.map(item => ({
                            ...item,
                            fill: getCarrierColor(item.carrier)
                          }))}
                          title="Capacity Expansion by Carrier"
                          unit="MW"
                        />
                      )
                    ) : (
                      <div className="text-center py-4">No data available</div>
                    )}
                  </div>
                </Card>

                {/* Generation Mix */}
                <Card className="p-4 min-h-[300px] section-generation-mix">
                  <h3 className="font-semibold mb-4">Generation Mix</h3>
                  {data.generationMix.length > 0 ? (
                    <DonutChart
                      data={data.generationMix.map(item => ({
                        ...item,
                        fill: getCarrierColor(item.carrier)
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

          <SheetFooter className="mt-auto">
            <div className="flex items-center space-x-2 pt-4 border-t border-border w-full">
              <Switch
                id="theme-left"
                checked={theme === "light"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
              <Label htmlFor="theme-left">
                {theme === "light" ? <Moon /> : <Sun />}
              </Label>
            </div>
          </SheetFooter>
        </SheetContent>
      </ScrollSyncPane>
    </Sheet>
  );
};

export default GlobeNav;
