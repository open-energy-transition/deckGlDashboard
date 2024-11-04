"use client";
import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import Map, {
  useControl,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MyCustomLayers } from "./components/Layer";

import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MyDropdown from "./MyDropdown";
import ModePannel from "./Mode";
import { Mode } from "./Mode";

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

import {
  getGeoJsonData,
  COUNTRY_S_NOM_RANGES,
  COUNTRY_COORDINATES,
} from "./components/Links";

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
    latitude: 37,
    longitude: -95,
    zoom: 4,
    minZoom: 2,
    maxZoom: 20,
    pitch: 10,
    bearing: 0,
  });

  const [mode, setMode] = useState<Mode>("split-screen");

  const [activeMap, setActiveMap] = useState<"left" | "right">("left");

  const [leftConrolsClosed, setLeftControlsClosed] = useState(false);
  const [rightConrolsClosed, setRightControlsClosed] = useState(false);

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

  const [country, selectedCountry] =
    useState<keyof typeof COUNTRY_COORDINATES>("US");
  const [layer2021, setLayer2021] = useState<GeoJsonLayer[]>([]);
  const [layer2050, setLayer2050] = useState<GeoJsonLayer[]>([]);

  useEffect(() => {
    const layer2021 = MyCustomLayers({
      id: "2021",
      polygonData: getGeoJsonData(country.toLowerCase()).regions_2021,
    });
    const layer2050 = MyCustomLayers({
      id: "2050",
      polygonData: getGeoJsonData(country.toLowerCase()).regions_2050,
    });
    setLayer2021(layer2021);
    setLayer2050(layer2050);
  }, [country]);

  return (
    <>
      <div className="relative h-screen overflow-hidden w-screen no-scrollbar">
        <Map
          id="left-map"
          {...viewState}
          padding={leftMapPadding}
          onMoveStart={onLeftMoveStart}
          onMove={activeMap === "left" ? onMove : undefined}
          style={LeftMapStyle}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={TOKEN}
        >
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" />
          <ScaleControl />

          <DeckGLOverlay layers={layer2021} />
        </Map>
        <Map
          id="right-map"
          {...viewState}
          padding={rightMapPadding}
          onMoveStart={onRightMoveStart}
          onMove={activeMap === "right" ? onMove : undefined}
          style={RightMapStyle}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={TOKEN}
        >
          <DeckGLOverlay layers={layer2050} />
          <FullscreenControl position="top-left" />
        </Map>
      </div>
      <ModePannel mode={mode} onModeChange={setMode} />
      <MyDropdown
        className={`fixed top-0 left-0 w-3/10  overflow-hidden z-50 m-3 ${
          leftConrolsClosed ? "translate-x-[-90%]" : "translate-x-0"
        }`}
        year={2021}
        buttonPosition="right"
        closeControls={() => {
          setLeftControlsClosed((t) => !t);
        }}
      />
      <MyDropdown
        className={`fixed top-[40%] md:top-0 right-0 w-3/10 overflow-hidden z-50 m-3 ${
          rightConrolsClosed ? "translate-x-[90%]" : "translate-x-0"
        }  `}
        year={2050}
        buttonPosition="left"
        closeControls={() => {
          setRightControlsClosed((t) => !t);
        }}
      />
    </>
  );
}
