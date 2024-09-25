import React, { useCallback } from "react";

type Mode = "side-by-side" | "split-screen";

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
    <div className="absolute bottom-0 right-0 z-30 bg-cyan-100/80 p-3">
      <h3>Side by Side</h3>
      <p>Synchronize two maps.</p>

      <div>
        <label>Mode: </label>
        <select value={props.mode} onChange={onModeChange}>
          <option value="side-by-side">Side by side</option>
          <option value="split-screen">Split screen</option>
        </select>
      </div>

      <div className="source-link">
        <a
          href="https://github.com/visgl/react-map-gl/tree/7.0-release/examples/side-by-side"
          target="_new"
        >
          View Code ↗
        </a>
      </div>
    </div>
  );
}
