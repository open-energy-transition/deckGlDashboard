"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import MainPageNav from "./popups/LandingGlobeNav";

const Globe = dynamic(() => import("./R3fGlobeScene"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-background" />,
});

interface DrawerProps {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LandingGlobe() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative w-full h-screen">
      <Globe />
      <MainPageNav open={isOpen} setIsOpen={setIsOpen} />
      <div className="absolute border-border border bg-background top-4 right-2 hidden md:block w-34 h-24 p-2 rounded-lg">
        Hover a country and see the investment needed in
        <ul className="list-none">
          <li>
            <span className="inline-block w-3 h-3 bg-[hsl(45,100%,50%)] mx-1 rounded-sm" />{" "}
            Solar
          </li>
          <li>
            <span className="inline-block w-3 h-3 bg-[hsl(195,85%,65%)] mx-1 rounded-sm" />{" "}
            Wind
          </li>
        </ul>
      </div>
    </div>
  );
}
