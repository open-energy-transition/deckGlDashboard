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
        • Only the power sector is currently considered.
      </p>
    </div>
  );
};
