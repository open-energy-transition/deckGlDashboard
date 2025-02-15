"use client";
import { useCountry } from "@/components/country-context";
import React, { useEffect, useState, useRef, useCallback, use } from "react";
import { useMouse } from "@uidotdev/usehooks";
import gsap from "gsap";
import { GeneratorData, SideDrawerProps } from "@/app/types";
import { Card } from "@/components/ui/card";
import { ChartRadial } from "@/components/Charts/ChartRadial";

const BusesTooltip = ({ hoveredBus }: { hoveredBus: string | null }) => {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [loading, setLoading] = useState(true);
  const [mouse] = useMouse();

  const [generatorData, setGeneratorData] = useState<GeneratorData[]>([]);

  const toolTipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toolTipRef.current) return;

    const { x, y } = mouse;
    gsap.to(toolTipRef.current, {
      delay: 0.08,
      x: x * 1.07,
      y: y * 0.1,
    });
  }, [mouse]);

  const fetchData = useCallback(async () => {
    if (!hoveredBus || !selectedCountry) {
      setGeneratorData([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/buseschart/${selectedCountry}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      const filteredData = result.data
        .filter((item: any) => item.bus === hoveredBus)
        .map((item: any) => ({
          Generator: item.Generator || item.generator || "",
          p_nom: item.p_nom || 0,
          p_nom_opt: item.p_nom_opt || 0,
          carrier: item.carrier || "",
          bus: item.bus || "",
          country_code: selectedCountry,
        }));

      setGeneratorData(filteredData);
      console.log("filteredData", filteredData);
    } catch (error) {
      console.error("Error fetching bus data:", error);
      setGeneratorData([]);
    } finally {
      setLoading(false);
    }
  }, [hoveredBus, selectedCountry]);

  useEffect(() => {
    if (!toolTipRef.current) return;

    if (generatorData.length > 0) {
      gsap.to(toolTipRef.current, {
        delay: 0.01,
        width: "24rem",
        height: "30rem",
        duration: 0.3,
      });
    } else {
      gsap.to(toolTipRef.current, {
        delay: 0.01,
        width: 0,
        height: 0,
        duration: 0.3,
      });
    }
  }, [, hoveredBus, selectedCountry, generatorData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {!hoveredBus ? (
        <div className="flex items-center justify-center py-8">
          No bus selected
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">Loading...</div>
      ) : (
        <>
          <div
            className="bg-card/90 absolute w-0 h-0  z-40 p-2 border-border border-2 rounded-md shadow-lg"
            ref={toolTipRef}
          >
            <h2 className="text-xl font-bold text-card-foreground">
              Nominal Capacity for hovered bus {hoveredBus}
            </h2>
            <ChartRadial
              data={generatorData}
              valueKey="p_nom"
              title="Nominal Capacity"
            />
          </div>
        </>
      )}
    </>
  );
};

export default BusesTooltip;
