"use client";
import React from "react";
import MainMap from "./MainMap";
import NetworkNav from "./popups/NetworkNav";

const Page = () => {
  const [networkView, setNetworkView] = React.useState<boolean>(false);
  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap networkView={networkView} />
        <NetworkNav networkView={networkView} setNetworkView={setNetworkView} />
      </div>
    </div>
  );
};

export default Page;
