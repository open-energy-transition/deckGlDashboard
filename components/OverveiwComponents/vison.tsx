import React from "react";
import { Eye } from "lucide-react";
import Image from "next/image";
export const Vision = () => {
  return (
    <div className="flex flex-col dark:text-secondary text-destructive">
      <Eye className="w-[3rem] h-[3rem]" />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Vision
      </h1>
      <p className=" md:text-[1.25rem] text-[1rem] md:w-[45rem] lg:w-[50rem] text-foreground">
        {" "}
        We want to expand PyPSA-Earth to support sector coupling, enabling
        integrated modeling of electricity, heating, transport, and industry;
        achieve high-resolution energy modeling with detailed representation of
        local grids and infrastructure; and support global transparency and
        collaboration through open data and open-source tools.
      </p>
      <Image
        src="/images/credits/energyModelChart.svg"
        alt="Background"
        width={0}
        height={0}
        className="w-[100%] max-w-[45rem] h-auto pt-12"
      />
    </div>
  );
};
