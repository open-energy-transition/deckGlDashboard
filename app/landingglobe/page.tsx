"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import GlobeNav from "./popups/LandingGlobeNav";
import RightDrawer from "./popups/RightDrawer";
import { LucideArrowRightSquare } from "lucide-react";

const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-background" />,
});

interface DrawerProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function LandingGlobe() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative w-full h-screen">
      <Globe />
      <GlobeNav open={isOpen} setIsOpen={setIsOpen} />
      <RightDrawer open={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
