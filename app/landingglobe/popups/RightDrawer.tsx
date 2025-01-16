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
  capacityExpansion: DataItem[];
  generationMix: DataItem[];
  investmentPerCO2: number;
}

const RightDrawer = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DrawerData>({
    totalCosts: [],
    investmentCosts: [],
    co2Emissions: [],
    electricityPrice: 0,
    capacities: [],
    capacityExpansion: [],
    generationMix: [],
    investmentPerCO2: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the synced scroll hook
  useSyncedScroll(contentRef, "scenarios-scroll");

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        totalCosts: [],
        investmentCosts: [],
        co2Emissions: [],
        electricityPrice: 0,
        capacities: [],
        capacityExpansion: [],
        generationMix: [],
        investmentPerCO2: 0
      });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching data for country:', selectedCountry);
      
      const responses = await Promise.all([
        fetch(`/api/total_costs_by_techs/${selectedCountry}/2050`),
        fetch(`/api/investment_costs_by_techs/${selectedCountry}/2050`),
        fetch(`/api/co2_emissions/${selectedCountry}/2050`),
        fetch(`/api/electricity_prices/${selectedCountry}/2050`),
        fetch(`/api/installed_capacity/${selectedCountry}/2050`),
        fetch(`/api/capacity_expansion/${selectedCountry}/2050`),
        fetch(`/api/generation_mix/${selectedCountry}/2050`),
        fetch(`/api/investment_per_co2_reduced/${selectedCountry}/2050`)
      ]);

      // Check if any response is not ok
      const failedResponses = responses.filter(r => !r.ok);
      if (failedResponses.length > 0) {
        console.error('Failed responses:', failedResponses.map(r => r.url));
        throw new Error('One or more API calls failed');
      }

      const [
        totalCostsData,
        investmentCostsData,
        co2EmissionsData,
        electricityPricesData,
        capacitiesData,
        capacityExpansionData,
        generationMixData,
        investmentPerCO2Data
      ] = await Promise.all(responses.map(r => r.json()));

      console.log('Raw CO2 Emissions data for 2050:', co2EmissionsData);

      const processedData: DrawerData = {
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
        capacityExpansion: capacityExpansionData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.capacity_expansion) || 0
        })) || [],
        generationMix: generationMixData.data?.map((item: any) => ({
          carrier: item.carrier,
          value: parseFloat(item.generation) || 0
        })) || [],
        investmentPerCO2: parseFloat(investmentPerCO2Data.data?.[0]?.investment_per_co2_reduced) || 0
      };

      // Log the length of arrays for debugging
      console.log('Data lengths:', {
        totalCosts: processedData.totalCosts.length,
        investmentCosts: processedData.investmentCosts.length,
        co2Emissions: processedData.co2Emissions.length,
        capacities: processedData.capacities.length,
        capacityExpansion: processedData.capacityExpansion.length,
        generationMix: processedData.generationMix.length
      });

      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      setData({
        totalCosts: [],
        investmentCosts: [],
        co2Emissions: [],
        electricityPrice: 0,
        capacities: [],
        capacityExpansion: [],
        generationMix: [],
        investmentPerCO2: 0
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  // Improve scroll sync
  useEffect(() => {
    if (contentRef.current) {
      const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        const scrollGroup = document.querySelectorAll('[data-scroll-group="scenarios-scroll"]');
        scrollGroup.forEach((el) => {
          if (el !== target) {
            (el as HTMLElement).scrollTop = target.scrollTop;
          }
        });
      };

      contentRef.current.addEventListener('scroll', handleScroll);
      return () => {
        contentRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

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
      load: "hsl(var(--chart-load))"
    };
    return colorMap[carrier.toLowerCase()] || `hsl(var(--chart-${Math.floor(Math.random() * 5)}))`;
  };

  return (
    <Sheet modal={false} open={true}>
      <ScrollSyncPane>
        <SheetContent
          ref={contentRef}
          side="right"
          className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
        >
          <SheetHeader>
            <SheetTitle>2050 Scenario</SheetTitle>
            <SheetDescription>
              {selectedCountry ? `Analyzing data for ${selectedCountry}` : 'Select a country to view data'}
            </SheetDescription>
          </SheetHeader>

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
                    data.co2Emissions.every(item => item.value === 0) ? (
                      <div className="text-sm text-muted-foreground text-center mb-4">
                        All CO2 emissions are zero in this 2050 scenario
                      </div>
                    ) : (
                      <DonutChart
                        data={data.co2Emissions.map(item => ({
                          ...item,
                          fill: getCarrierColor(item.carrier)
                        }))}
                        title="CO2 Emissions by Carrier"
                        unit="tCO2"
                      />
                    )
                  ) : (
                    <div className="text-center py-4">No data available</div>
                  )}
                  <div className="mt-4 p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">Investment per CO2 reduced</p>
                    <p className="text-2xl font-bold">{data.investmentPerCO2.toFixed(2)} €/tCO2</p>
                  </div>
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
                      <DonutChart
                        data={data.capacityExpansion.map(item => ({
                          ...item,
                          fill: getCarrierColor(item.carrier)
                        }))}
                        title="Capacity Expansion by Carrier"
                        unit="MW"
                      />
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
            {mounted && (
              <div className="flex items-center space-x-2 pt-4 border-t border-border w-full">
                <Switch
                  id="theme"
                  checked={theme === "light"}
                  onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
                <Label htmlFor="theme">
                  {theme === "light" ? <Moon /> : <Sun />}
                </Label>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </ScrollSyncPane>
    </Sheet>
  );
};

export default RightDrawer;
