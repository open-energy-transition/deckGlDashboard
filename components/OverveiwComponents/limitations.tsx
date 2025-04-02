import React from "react";
import DiscordIcon from "../icons/discord-icon";
import { Crosshair } from "lucide-react";

export const Limitations = () => {
  return (
    <div className="flex flex-col text-destructive dark:text-secondary">
      <Crosshair className="w-[3rem] h-[3rem]" />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Limitations
      </h1>
      <ul className="list-disc pl-5 space-y-2 md:text-[1.25rem] text-[1rem] text-foreground lg:w-[50rem]">
        <li>Only the power sector is currently considered.</li>
        <li>The distribution grid has not yet been modeled in detail.</li>
        <li>No manual corrections have been applied to input datasets.</li>
        <li>The visualisation is currently available for only X countries (global coverage is still in progress).
        </li>
      </ul>
    </div>
  );
};
