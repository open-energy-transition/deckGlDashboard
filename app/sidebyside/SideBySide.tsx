"use client";
import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import Map, {
  useControl,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  ViewStateChangeEvent,
} from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MyDropdown from "./MyDropdown";
import ModePannel from "./Mode";
import { Mode } from "./Mode";
import { useCountry } from "@/components/country-context";
import { getGeoJsonData, COUNTRY_COORDINATES, COUNTRY_VIEW_CONFIG } from "./components/Links";

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

const TOKEN = "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw";

const LeftMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%"
};

const RightMapStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%"
};

export default function SideBySide() {
  const { selectedCountry } = useCountry();
  const [mode, setMode] = useState<Mode>("split-screen");
  const [rightConrolsClosed, setRightControlsClosed] = useState(false);
  const [activeMap, setActiveMap] = useState<"left" | "right">("left");

  const [viewState, setViewState] = useState({
    latitude: COUNTRY_COORDINATES[selectedCountry][0],
    longitude: COUNTRY_COORDINATES[selectedCountry][1],
    zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
    minZoom: 2,
    maxZoom: 20,
    pitch: 0,
    bearing: 0
  });

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

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt: ViewStateChangeEvent) => setViewState({
    ...evt.viewState,
    minZoom: 2,
    maxZoom: 20
  }), []);

  const [layer2021, setLayer2021] = useState<GeoJsonLayer[]>([]);
  const [layer2050, setLayer2050] = useState<GeoJsonLayer[]>([]);

  useEffect(() => {
    const commonProps = {
      stroked: true,
      filled: true,
      opacity: 0.6,
      getFillColor: [220, 20, 60, 80] as [number, number, number, number],
      getLineColor: [255, 255, 255] as [number, number, number],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      pickable: false,
      parameters: {
        depthTest: false,
        blend: true,
        blendFunc: [770, 771]
      }
    };

    const geoJsonData = getGeoJsonData(selectedCountry);
    
    setLayer2021([
      new GeoJsonLayer({
        id: 'regions-2021',
        data: geoJsonData.regions_2021,
        ...commonProps
      })
    ]);

    setLayer2050([
      new GeoJsonLayer({
        id: 'regions-2050',
        data: geoJsonData.regions_2050,
        ...commonProps
      })
    ]);
  }, [selectedCountry]);

  useEffect(() => {
    // Update viewState when country changes
    setViewState({
      ...viewState,
      latitude: COUNTRY_COORDINATES[selectedCountry][0],
      longitude: COUNTRY_COORDINATES[selectedCountry][1],
      zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
      bearing: 0,
      pitch: 0
    });
  }, [selectedCountry]);

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
          <NavigationControl showCompass={false} />
          <FullscreenControl />
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
          <NavigationControl showCompass={false} />
          <DeckGLOverlay layers={layer2050} />
        </Map>
      </div>

      <ModePannel mode={mode} onModeChange={setMode} />
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
