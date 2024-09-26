"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { FlyToInterpolator } from "deck.gl";
import { MyCustomLayers } from "./Layer";
import { US_DATA, COLUMBIA_DATA, NIGERIA_DATA } from "./Links";
import { BlockProperties } from "./Layer";
import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import BottomDrawer from "./BottomDrawer";
import MySideDrawer from "./SideDrawer";

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

const MAP_STYLE =
  // "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function MainMap({ mapStyle = MAP_STYLE }) {
  const countries = [US_DATA, COLUMBIA_DATA, NIGERIA_DATA];
  const DeckRef = useRef(null);

  const [selectedPointID, setSelectedPointID] = useState(null);
  const [hoverPointID, setHoverPointID] = useState(null);

  const [selectedLineID, setSelectedLineID] = useState(null);
  const [hoverLineID, setHoverLineID] = useState(null);
  const [lineOpen, setLineOpen] = useState(false);

  const [initialViewState, setInitialViewState] =
    useState<MapViewState>(INITIAL_VIEW_STATE);

  const [open, setOpen] = useState(false);

  const flyToCity = useCallback((info: any) => {
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
    console.log(open, selectedPointID);
    if (!open && selectedPointID) {
      setOpen(false);
      setSelectedPointID(null);
    }
  }, [open]);

  useEffect(() => {
    console.log(open, selectedLineID);
    if (!lineOpen && selectedLineID) {
      setLineOpen(false);
      setSelectedLineID(null);
    }
  }, [lineOpen]);

  const layers = countries.flatMap((country) =>
    MyCustomLayers(
      country.substations,
      country.buses,
      country.lines,
      country.polygon,
      country.id
    )
  );

  const temp = [
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
          flyToCity(info.object.geometry.coordinates);
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
          flyToCity(info.coordinate);
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
  ];

  layers.push(temp[1]);
  layers.push(temp[0]);

  return (
    <>
      <DeckGL
        layers={layers}
        initialViewState={initialViewState}
        controller={true}
        ref={DeckRef}
      >
        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
      <BottomDrawer />
      <MySideDrawer open={open} setOpen={setOpen} side={"right"} />
      <MySideDrawer open={lineOpen} setOpen={setLineOpen} side={"left"} />
    </>
  );
}
