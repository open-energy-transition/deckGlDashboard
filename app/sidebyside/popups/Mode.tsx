import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { on } from "events";
import { SelectContent } from "@radix-ui/react-select";

export type Mode = "split-screen" | "side-by-side";
export interface ModePannelProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export default function ModePannel({ mode, setMode }: ModePannelProps) {
  useEffect(() => {
    console.log(mode);
  }, [mode]);

  return (
    <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select View Mode" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
        <SelectItem value="split-screen">Split Screen</SelectItem>
        <SelectItem value="side-by-side">Side by Side</SelectItem>
      </SelectContent>
    </Select>
  );
}
