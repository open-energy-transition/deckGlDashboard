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
        We are coordinating the global effort to create a validated
        dataset of the energy-related inputs to enable accurate energy
        system modeling of every country in the world. Recently,
        PyPSA-Earth has been expanded to include sector coupling,
        enabling integrated modeling of different economic sectors,
        including electricity, hydrogen, heating, transport, industry, and
        agriculture. A dedicated modeling stream is focused  on the
        detailed representation of microgrids and distribution infrastructure.
      </p>
    </div>
  );
};
