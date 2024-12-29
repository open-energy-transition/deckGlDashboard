import React, { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";

export type Mode = "split-screen" | "side-by-side";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ModePannel() {
  const [mode, setMode] = useState<Mode>("split-screen");
  return (
    <>
      <h3>Side by Side</h3>
      <p>Synchronize two maps.</p>

      <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select View Mode`" />
          <SelectItem value="split-screen">Split Screen</SelectItem>
          <SelectItem value="side-by-side">Side by Side</SelectItem>
        </SelectTrigger>
      </Select>
    </>
  );
}
