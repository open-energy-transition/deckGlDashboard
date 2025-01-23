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
        <NetworkNav show={show} setShow={setShow} />
        <div
          className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 h-20 w-20 cursor-pointer"
          onClick={() => {
            setShow(true);
          }}
        >
          <LucideArrowRightSquare className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default Page;
