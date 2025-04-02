import React from "react";
import DiscordIcon
  from "../icons/discord-icon";
import { Crosshair } from 'lucide-react';

export const Limitations = () => {
  return <div className="flex flex-col">
      <Crosshair className="w-[3rem] h-[3rem]" />
    <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]"> Limitations</h1>
  <p className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">	•	Only the power sector is currently considered.
	<p className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground"> •	The distribution grid has not yet been modeled in detail.</p>
	<p className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground"> •	No manual corrections have been applied to input datasets.</p>
	<p className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground"> •	The visualisation is currently available for only X countries (global coverage is still in progress).</p></p></div>;
};
