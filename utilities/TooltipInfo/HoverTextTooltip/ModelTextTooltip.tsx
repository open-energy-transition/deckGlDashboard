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
import { LinkIcon } from "lucide-react";
import GithubIcon from "@/components/icons/github-icon";
import Link from "next/link";

interface ChartInfoTooltipProps {
  tooltipInfo?: PyPSA_info_type | Ember_info_type | EIA_info_type;
  className?: string;
  DisplayText: string;
}

const ModelTextTooltip = ({
  tooltipInfo,
  className,
  DisplayText,
}: ChartInfoTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        className={`cursor-pointer inline-block decoration-solid underline decoration-1`}
        style={{ textDecoration: "underline" }}
      >
        <p>{DisplayText}</p>
      </HoverCardTrigger>
      <HoverCardContent style={{ width: "15rem" }}>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {tooltipInfo?.full_name}
          </h3>
          <p className="text-sm text-muted-foreground font-thin">
            {tooltipInfo?.definition}
          </p>
        </div>
        <div className="flex gap-4 pt-2">
          {tooltipInfo?.Link !== "" && (
            <Link href={tooltipInfo?.Link || ""} target="_blank">
              <LinkIcon className="h-4 w-4" />
            </Link>
          )}

          {tooltipInfo?.githubLink !== "" && (
            <Link
              href={tooltipInfo?.githubLink || ""}
              className="h-4 w-4"
              target="_blank"
            >
              <GithubIcon />
            </Link>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default ModelTextTooltip;
