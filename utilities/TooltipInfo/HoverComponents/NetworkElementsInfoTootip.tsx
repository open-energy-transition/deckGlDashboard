"use client";
import React from "react";
import { Generation_info_type } from "../ExplainerText/GenerationMix";
import { Installed_capacity_info_type } from "../ExplainerText/InstalledCapacity";
import { NominalCapacity_info_type } from "../ExplainerText/NominalCapacity";
import { TotalSystemCost_info_type } from "../ExplainerText/TotalSystemCost";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Bus_info_type } from "../ExplainerText/NetworkElements/Bus_text";
import { Line_info_type } from "../ExplainerText/NetworkElements/Line_Text";

interface NetworkElementInfoTooltipProps {
  tooltipInfo?: Bus_info_type | Line_info_type;
  className?: string;
}

const NetworkElementInfoTooltip = ({
  tooltipInfo,
  className,
}: NetworkElementInfoTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        className={`relative cursor-pointer inline-block `}
      >
        <InfoCircledIcon
          className={`${className || ""}`}
          width={24}
          height={24}
        />
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 max-w-md p-4 space-y-4"
        style={{ width: "var(--tooltip-width, 200px)" }}
      >
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {tooltipInfo?.full_name}
          </h3>
          <p className="text-sm text-muted-foreground font-thin">
            {tooltipInfo?.definition}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default NetworkElementInfoTooltip;
