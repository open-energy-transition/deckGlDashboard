"use client";

import React, { useEffect, useState } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { US_2021_DATA, US_2050_DATA } from "./Links";
import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 2,
  maxZoom: 16,
  pitch: 5,
  bearing: 0,
};

const MAP_STYLE =
  // "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function SolarPolygon({
  mapStyle = MAP_STYLE,
}: {
  mapStyle?: string;
}) {
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
      getFillColor: [225, 75, 75],
      lineWidthMinPixels: 2,
      // lineWidthScale: 20,
      dashArray: [10, 5],
      getLineWidth: 10,
      pickable: true,
    }),
  ];

  return (
    <DeckGL
      layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      style={{ width: "100%", height: "100%" }}
    >
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}
