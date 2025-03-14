"use client";
import React, { useState } from "react";
import MainMap from "./MainMap";
import NetworkNav from "./popups/NetworkNav";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";

export default function Page() {
  const [networkView, setNetworkView] = useState(false);
  const [regionGeneratorValue, setRegionGeneratorValue] = useState<keyof typeof regionalGeneratorTypes>("CCGT");
  const [regionParamValue, setRegionParamValue] = useState("cf");

  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap
          networkView={networkView}
          setNetworkView={setNetworkView}
          regionGeneratorValue={regionGeneratorValue}
          setRegionGeneratorValue={setRegionGeneratorValue}
          regionParamValue={regionParamValue}
          setRegionParamValue={setRegionParamValue}
        />
        <NetworkNav
          networkView={networkView}
          setNetworkView={setNetworkView}
          regionGeneratorValue={regionGeneratorValue}
          setRegionGeneratorValue={setRegionGeneratorValue}
          regionParamValue={regionParamValue}
          setRegionParamValue={setRegionParamValue}
        />
      </div>
    </div>
  );
}
