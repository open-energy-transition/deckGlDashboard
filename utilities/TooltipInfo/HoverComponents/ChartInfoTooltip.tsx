"use client";
import React from "react";
import { Generation_info_type } from "../ExplainerText/GenerationMix";
import { Installed_capacity_info_type } from "../ExplainerText/InstalledCapacity";
import { NominalCapacity_info_type } from "../ExplainerText/NominalCapacity";
import { Investment_info_type } from "../ExplainerText/RequiredInvestment";
import { TotalSystemCost_info_type } from "../ExplainerText/TotalSystemCost";

import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ChartInfoTooltipProps {
  tooltipInfo?:
    | Generation_info_type
    | Installed_capacity_info_type
    | NominalCapacity_info_type
    | Investment_info_type
    | TotalSystemCost_info_type;
}

const ChartInfoTooltip = ({ tooltipInfo }: ChartInfoTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">hover button</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-1">
          <p className="text-sm">{tooltipInfo?.full_name}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default ChartInfoTooltip;
