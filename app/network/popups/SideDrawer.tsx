import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
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
import { ChartRadial } from "@/components/Charts/ChartRadial";
import { SideDrawerProps, GeneratorData } from "@/app/types";
import { Card } from "@/components/ui/card";

export default function MySideDrawer({ open, setOpen, side, data }: SideDrawerProps) {
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
      const filteredData = result.data.filter(
        (item: GeneratorData) => item.bus === data.busId
      );
      
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

  console.log("SideDrawer - Rendering with data:", { 
    loading, 
    dataLength: generatorData.length 
  });

  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetContent
        side={side}
        className="overflow-y-scroll no-scrollbar w-96 flex flex-col"
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
  );
}
