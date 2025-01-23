"use client";
import React from "react";
import MainMap from "./MainMap";
import NetworkNav from "./popups/NetworkNav";
import { LucideArrowRightSquare } from "lucide-react";

const Page = () => {
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap />
        <NetworkNav />
      </div>
    </div>
  );
};

export default Page;
