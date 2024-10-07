"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { FlyToInterpolator } from "deck.gl";
import { MyCustomLayers } from "./components/Layer";
import { US_DATA, COLUMBIA_DATA, NIGERIA_DATA } from "./components/Links";
import { BlockProperties } from "./components/Layer";
import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import BottomDrawer from "./popups/BottomDrawer";
import MySideDrawer from "./popups/SideDrawer";
import { useTheme } from "next-themes";
import { Feature, Geometry } from "geojson";
import type { PickingInfo } from "deck.gl";
import CountrySelect from "./CountrySelect";

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json"; // eslint-disable-line

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 5,
  minZoom: 3,
  maxZoom: 20,
  pitch: 30,
  bearing: 0,
};

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function MainMap() {
  const { theme, setTheme } = useTheme();

  const countries = [US_DATA, COLUMBIA_DATA, NIGERIA_DATA];
  const DeckRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(US_DATA);

  const [selectedPointID, setSelectedPointID] = useState(null);
  const [hoverPointID, setHoverPointID] = useState(null);

  const [selectedLineID, setSelectedLineID] = useState(null);
  const [hoverLineID, setHoverLineID] = useState(null);
  const [lineOpen, setLineOpen] = useState(false);

  const [initialViewState, setInitialViewState] =
    useState<MapViewState>(INITIAL_VIEW_STATE);

  const [open, setOpen] = useState(false);

  const flyToGeometry = useCallback((info: any) => {
    const cords = info;
    console.log(cords);
    setInitialViewState({
      latitude: cords[1],
      longitude: cords[0],
      zoom: 5,
      minZoom: 3,
      maxZoom: 20,
      pitch: 30,
      bearing: 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: 500,
    });
  }, []);

  useEffect(() => {
    console.log(DeckRef.current);
  }, []);

  useEffect(() => {
    if (selectedPointID) {
    }
  }, [selectedPointID]);

  useEffect(() => {
    if (!lineOpen && selectedLineID) {
      setLineOpen(false);
      setSelectedLineID(null);
    }
  }, [lineOpen]);

  useEffect(() => {
    if (!open && selectedPointID) {
      setOpen(false);
      setSelectedPointID(null);
    }
  }, [open]);

  // useEffect(() => {
  //   console.log(selectedCountry.coordinates);
  //   flyToGeometry(selectedCountry.coordinates);
  // }, [selectedCountry]);

  // const layers = countries.flatMap((country) =>
  //   MyCustomLayers(
  //     country.substations,
  //     country.buses,
  //     country.lines,
  //     country.polygon,
  //     country.id
  //   )
  // );

  // somehow export hese functions without type errors to some other file

  // function onClickPoint(info: PickingInfo, e: React.MouseEvent<HTMLElement>) {
  //   e.stopPropagation();
  //   const id = info.object.id;
  //   if (selectedPointID === id) {
  //     setSelectedPointID(null);
  //     setOpen(false);
  //   } else {
  //     setSelectedPointID(id);
  //     flyToGeometry(info.object.geometry.coordinates);
  //     setOpen(true);
  //   }
  // }
  // function onHoverPoint() {}
  // function getRadius(d: Feature<Geometry, BlockProperties>): number {
  //   if (selectedPointID === d.id) {
  //     return 1100;
  //   } else if (hoverPointID === d.id) {
  //     return 750;
  //   } else {
  //     return 500;
  //   }
  // }

  // function onClickLine() {}
  // function onHoverLine() {}
  // function getLineWidth() {}

  const temp = [
    new GeoJsonLayer({
      id: `Linesus`,
      data: US_DATA.lines,
      opacity: 0.8,
      stroked: true,
      filled: true,
      pickable: true,
      lineWidthScale: 20,
      getLineColor: [227, 26, 28],
      getFillColor: [227, 26, 28],
      getLineWidth: (d) => {
        if (selectedLineID === d.id) {
          return 2300;
        } else if (hoverLineID === d.id) {
          return 1600;
        } else {
          return 700;
        }
      },
      onClick: (info, e) => {
        console.log(info, e);
        e.stopPropagation();
        const id = info.object.id;
        if (selectedLineID === id) {
          setSelectedLineID(null);
          setLineOpen(false);
        } else {
          setSelectedLineID(id);
          flyToGeometry(info.coordinate);
          setLineOpen(true);
        }
      },
      onHover: (info, e) => {
        console.log(info);
        if (info.object) {
          const id = info.object.id;
          setHoverLineID(id);
        } else {
          setHoverLineID(null);
        }
      },
      updateTriggers: {
        getLineWidth: [selectedLineID, hoverLineID],
      },
      transitions: {
        getLineWidth: 100,
      },
      autoHighlight: true,
      parameters: {
        depthTest: false,
      },
    }),
    new GeoJsonLayer<BlockProperties>({
      id: `Buses${2}`,
      data: US_DATA.buses,
      opacity: 1,
      stroked: false,
      filled: true,
      pointType: "circle",
      wireframe: true,
      getPointRadius: (d) => {
        if (selectedPointID === d.id) {
          return 1100;
        } else if (hoverPointID === d.id) {
          return 750;
        } else {
          return 500;
        }
      },
      pointRadiusScale: 100,
      onClick: (info, e) => {
        e.stopPropagation();
        const id = info.object.id;
        if (selectedPointID === id) {
          setSelectedPointID(null);
          setOpen(false);
        } else {
          setSelectedPointID(id);
          flyToGeometry(info.object.geometry.coordinates);
          setOpen(true);
        }
      },
      onHover: (info, e) => {
        if (info.object) {
          const id = info.object.id;
          setHoverPointID(id);
        } else {
          setHoverPointID(null);
        }
      },
      getFillColor: [72, 123, 182],
      pickable: true,
      updateTriggers: {
        getPointRadius: [selectedPointID, hoverPointID],
      },
      transitions: {
        getPointRadius: 100,
      },
      autoHighlight: true,
      parameters: {
        depthTest: false,
      },
    }),
  ];

  // layers.push(temp[1]);
  // layers.push(temp[0]);

  return (
    <>
      <div onContextMenu={(evt) => evt.preventDefault()}>
        <DeckGL
          // layers={layers}
          layers={temp}
          initialViewState={initialViewState}
          controller={true}
          ref={DeckRef}
        >
          <Map
            reuseMaps
            mapStyle={theme === "light" ? MAP_STYLE_LIGHT : MAP_STYLE_DARK}
          />
        </DeckGL>
      </div>
      <BottomDrawer />
      <MySideDrawer open={open} setOpen={setOpen} side={"right"} data={"Bus"} />
      <MySideDrawer
        open={lineOpen}
        setOpen={setLineOpen}
        side={"left"}
        data={"Line"}
      />
      {/* <CountrySelect
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      /> */}
    </>
  );
}
