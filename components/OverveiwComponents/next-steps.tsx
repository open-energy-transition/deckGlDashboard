import React from "react";
import { Footprints } from "lucide-react";
export const NextSteps = () => {
  return (
    <div className="flex flex-col text-destructive dark:text-secondary">
      <Footprints className="w-[3rem] h-[3rem]" />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Next Steps
      </h1>
      <p className=" md:text-[1.25rem] text-[1rem] md:w-[45rem] lg:w-[50rem] text-foreground">
        {" "}
        We want to expand PyPSA-Earth to support sector coupling, enabling
        integrated modeling of electricity, heating, transport, and industry;
        achieve high-resolution energy modeling with detailed representation of
        local grids and infrastructure.
      </p>
    </div>
  );
};
