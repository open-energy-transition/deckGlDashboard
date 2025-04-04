"use client";
import React from "react";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export const Vision = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col dark:text-secondary text-destructive">
      <Eye className="w-[3rem] h-[3rem]" />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Vision
      </h1>
      <ul className="list-disc pl-5 md:text-[1.25rem] text-[1rem] md:w-[45rem] lg:w-[50rem] text-foreground space-y-3">
        <li>
          Empower Decision-Making: Transform complex energy models into clear,
          actionable insights for policy and investment.
        </li>
        <li>
          Accelerate Insight Delivery: Fast-track the flow of research data to
          decision-makers through visualisations & automation.
        </li>
        <li>
          Champion Open Collaboration: Leverage open data and open-source 
          tools to foster transparency and cooperation.
        </li>
      </ul>
      {theme === "dark" ? (
        <Image
          src="/images/credits/energyModelChartDark.svg"
          alt="Background"
          width={0}
          height={0}
          className="w-[100%] max-w-[45rem] h-auto pt-12"
        />
      ) : (
        <Image
          src="/images/credits/energyModelChart.svg"
          alt="Background"
          width={0}
          height={0}
          className="w-[100%] max-w-[45rem] h-auto pt-12"
        />
      )}
    </div>
  );
};
