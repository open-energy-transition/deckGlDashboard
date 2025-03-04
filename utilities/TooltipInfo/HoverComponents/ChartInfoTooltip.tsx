"use client";
import React from "react";
import { Generation_info_type } from "../ExplainerText/GenerationMix";
import { Installed_capacity_info_type } from "../ExplainerText/InstalledCapacity";
import { NominalCapacity_info_type } from "../ExplainerText/NominalCapacity";
import { TotalSystemCost_info_type } from "../ExplainerText/TotalSystemCost";

import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ChartInfoTooltipProps {
  tooltipInfo?:
    | Generation_info_type
    | Installed_capacity_info_type
    | NominalCapacity_info_type
    | TotalSystemCost_info_type;
  className?: string;
}

const ChartInfoTooltip = ({
  tooltipInfo,
  className,
}: ChartInfoTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        className={`relative cursor-pointer inline-block `}
      >
        <InfoCircledIcon className={`${className || ""}`} />
      </HoverCardTrigger>
      <HoverCardContent className="w-96 bg-background">
        <div className="space-y-2 text-sm">
          <p className="text-base">{tooltipInfo?.definition}</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>Unit</p>
              <p>{tooltipInfo?.unit}</p>
            </div>
            <div>
              <p>Source</p>
              <p>{tooltipInfo?.source}</p>
            </div>
          </div>
          <div>
            <p>Values</p>
            <p>{tooltipInfo?.values}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default ChartInfoTooltip;
