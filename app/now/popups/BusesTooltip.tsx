"use client";
import { useCountry } from "@/components/country-context";
import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { GeneratorData } from "@/app/types";
import { ChartRadial } from "@/components/Charts/ChartRadial";
import { GenerationMixchartConfigSmall } from "@/utilities/GenerationMixChartConfig";

type CarrierType = keyof typeof GenerationMixchartConfigSmall;

const BusesTooltip = ({ hoveredBus }: { hoveredBus: string | null }) => {
  const { selectedCountry } = useCountry();
  const [loading, setLoading] = useState(true);
  const [generatorData, setGeneratorData] = useState<GeneratorData[]>([]);
  const toolTipRef = useRef<HTMLDivElement>(null);

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
          color: GenerationMixchartConfigSmall[(item.carrier || "").toLowerCase() as CarrierType]?.color || "hsl(var(--chart-1))"
        }));

      setGeneratorData(filteredData);
    } catch (error) {
      console.error("Error fetching bus data:", error);
      setGeneratorData([]);
    } finally {
      setLoading(false);
    }
  }, [hoveredBus, selectedCountry]);

  useEffect(() => {
    if (!toolTipRef.current) return;

    if (hoveredBus) {
      gsap.to(toolTipRef.current, {
        delay: 0.01,
        width: "24rem",
        height: "30rem",
        duration: 0.3,
        opacity: 1,
      });
    } else {
      gsap.to(toolTipRef.current, {
        delay: 0.01,
        width: 0,
        height: 0,
        duration: 0.3,
        opacity: 0,
      });
    }
  }, [hoveredBus, selectedCountry, generatorData, loading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div
        className={`bg-card/90 absolute w-0 h-0 z-40 p-2 border-border border-2 rounded-md shadow-lg overflow-hidden opacity-0`}
        ref={toolTipRef}
      >
        {!hoveredBus ? (
          <div className="flex items-center justify-center">
            No bus selected
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-card-foreground">
              Nominal Capacity
            </h2>
            <ChartRadial
              data={generatorData}
              valueKey="p_nom"
              title="Nominal Capacity"
            />
          </>
        )}
      </div>
    </>
  );
};

export default BusesTooltip;
