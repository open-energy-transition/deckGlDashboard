"use client";
import React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { PyPSA_info_type } from "../ExplainerText/Models/Pypsa";
import { Ember_info_type } from "../ExplainerText/Models/Ember";
import { EIA_info_type } from "../ExplainerText/Models/EIA";
import { Link, LinkIcon } from "lucide-react";
import GithubIcon from "@/components/icons/github-icon";

interface ChartInfoTooltipProps {
  tooltipInfo?: PyPSA_info_type | Ember_info_type | EIA_info_type;
  className?: string;
}

const ModelInfoTooltip = ({
  tooltipInfo,
  className,
}: ChartInfoTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild className={`cursor-pointer inline-block `}>
        <QuestionMarkCircledIcon className={`${className || ""}`} />
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {tooltipInfo?.full_name}
          </h3>
          <p className="text-sm text-muted-foreground font-thin">
            {tooltipInfo?.definition}
          </p>
        </div>

        {tooltipInfo?.Link && (
          <Link href={tooltipInfo.Link}>
            <LinkIcon className="h-6 w-6" />
          </Link>
        )}

        {tooltipInfo?.githubLink && (
          <Link href={tooltipInfo.githubLink}>
            <GithubIcon className="h-6 w-6" />
          </Link>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
export default ModelInfoTooltip;
