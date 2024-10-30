import React, { useCallback } from "react";
import { Card } from "../../components/ui/card";

export type Mode = "split-screen" | "side-by-side";

export default function ModePannel(props: {
  mode: Mode;
  onModeChange: (newMode: Mode) => void;
}) {
  const onModeChange = useCallback(
    (evt) => {
      props.onModeChange(evt.target.value as Mode);
    },
    [props.onModeChange]
  );

  return (
    <Card className="absolute bottom-8 right-0 md:left-1/2 md:transform md:-translate-x-1/2 w-screen/2 md:w-52 z-30 bg-background p-3">
      <h3>Side by Side</h3>
      <p>Synchronize two maps.</p>

      <div>
        <label>Mode: </label>
        <select
          className="bg-black text-white"
          value={props.mode}
          onChange={onModeChange}
        >
          <option value="side-by-side">Side by side</option>
          <option value="split-screen">Split screen</option>
        </select>
      </div>
    </Card>
  );
}
