"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChartRadial } from "@/components/Charts/ChartRadial";
import { Card } from "@/components/ui/card";
import { GeneratorData, SideDrawerProps } from "@/app/types";

export default function MySideDrawer({ open, setOpen, side = "right", data }: SideDrawerProps) {
  const [generatorData, setGeneratorData] = useState<GeneratorData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!data?.busId || !data?.countryCode) {
      setGeneratorData([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/buseschart/${data.countryCode}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      const filteredData = result.data
        .filter((item: any) => item.bus === data.busId)
        .map((item: any) => ({
          Generator: item.Generator || item.generator || '',
          p_nom: item.p_nom || 0,
          p_nom_opt: item.p_nom_opt || 0,
          carrier: item.carrier || '',
          bus: item.bus || '',
          country_code: data.countryCode
        }));
      
      setGeneratorData(filteredData);
    } catch (error) {
      console.error('Error fetching bus data:', error);
      setGeneratorData([]);
    } finally {
      setLoading(false);
    }
  }, [data?.busId, data?.countryCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div
        className="absolute top-0 right-0 w-20 h-20 bg-red-50"
        onClick={() => {
          setOpen(true);
        }}
      ></div>
      <Sheet modal={false} open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
        >
          <SheetHeader>
            <SheetTitle>
              {data?.busId ? `Bus ${data.busId} Statistics` : "Select a Bus"}
            </SheetTitle>
            <SheetDescription>
              {data?.busId
                ? "Generation capacity by carrier type"
                : "Click on a bus to see its statistics"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1">
            {!data?.busId ? (
              <div className="flex items-center justify-center py-8">
                No bus selected
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                Loading...
              </div>
            ) : (
              <>
                <Card className="my-4 flex flex-col justify-between align-middle gap-2">
                  <ChartRadial
                    data={generatorData}
                    valueKey="p_nom"
                    title="Nominal Capacity"
                  />
                </Card>
                <Card className="my-4 flex flex-col justify-between align-middle gap-2">
                  <ChartRadial
                    data={generatorData}
                    valueKey="p_nom_opt"
                    title="Optimal Capacity"
                  />
                </Card>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
