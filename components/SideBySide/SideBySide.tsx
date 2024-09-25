"use client";
import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import Map, { useControl } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { US_2021_DATA, US_2050_DATA } from "../SolarSection/Links";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MyDropdown from "../SolarSection/MyDropdown";

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

type Mode = "side-by-side" | "split-screen";

function ControlPanel(props: {
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
    <div className="absolute bottom-0 right-0 z-30">
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

const TOKEN =
  "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw"; // Set your mapbox token here

const LeftMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
};
const RightMapStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
};

export default function SideBySide() {
  const [viewState, setViewState] = useState({
    longitude: -122.43,
    latitude: 37.78,
    zoom: 10,
    minZoom: 3,
    maxZoom: 20,
    pitch: 30,
  });
  const [mode, setMode] = useState<Mode>("side-by-side");

  const [activeMap, setActiveMap] = useState<"left" | "right">("left");

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt) => setViewState(evt.viewState), []);

  const width = typeof window === "undefined" ? 100 : window.innerWidth;
  const leftMapPadding = useMemo(() => {
    return {
      left: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }, [width, mode]);
  const rightMapPadding = useMemo(() => {
    return {
      right: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0,
    };
  }, [width, mode]);

  const layers = [
    new GeoJsonLayer({
      id: `polygon-layer${US_2021_DATA.id}`,
      data: US_2050_DATA.polygon,
      stroked: true,
      opacity: 0.25,
      filled: true,
      extruded: false,
      wireframe: false,
      getElevation: 0,
      getLineColor: [75, 75, 75],
      getFillColor: [225, 75, 75, 20],
      lineWidthMinPixels: 2,
      // lineWidthScale: 20,
      dashArray: [10, 5],
      getLineWidth: 10,
      pickable: true,
    }),
  ];

  return (
    <>
      <div className="relative h-screen overflow-hidden">
        <Map
          id="left-map"
          {...viewState}
          padding={leftMapPadding}
          onMoveStart={onLeftMoveStart}
          onMove={activeMap === "left" && onMove}
          style={LeftMapStyle}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={TOKEN}
        >
          <DeckGLOverlay layers={layers} />
        </Map>
        <Map
          id="right-map"
          {...viewState}
          padding={rightMapPadding}
          onMoveStart={onRightMoveStart}
          onMove={activeMap === "right" && onMove}
          style={RightMapStyle}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={TOKEN}
        ></Map>
      </div>
      <ControlPanel mode={mode} onModeChange={setMode} />
      <MyDropdown className="absolute top-0 left-0 w-3/10  overflow-hidden z-50" />
      <MyDropdown className="absolute top-0 right-0 w-3/10 overflow-hidden z-50" />
    </>
  );
}
