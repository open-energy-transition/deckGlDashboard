"use client";

import React, { useEffect, useState } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { MyCustomLayers } from "./Layer";
import { US_DATA, COLUMBIA_DATA, NIGERIA_DATA } from "./Links";

// Source data GeoJSON
const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json"; // eslint-disable-line

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

export default function MainMap({
  mapStyle = MAP_STYLE,
}: {
  mapStyle?: string;
}) {
  const countries = [US_DATA, COLUMBIA_DATA, NIGERIA_DATA];

  const [selectedLineIds, setSelectedLineIds] = useState([]);

  useEffect(() => {
    console.log(selectedLineIds);
  }, [selectedLineIds]);

  const handleLineClick = (info) => {
    const clickedFeatureId = info.object?.properties?.id;
    if (clickedFeatureId) {
      setSelectedLineIds([clickedFeatureId]); // For multiple selections, adjust accordingly
    }
  };

  const layers = countries.flatMap((country) =>
    MyCustomLayers(
      country.substations,
      country.buses,
      country.lines,
      country.polygon,
      country.id,
      selectedLineIds,
      handleLineClick
    )
  );

  return (
    <DeckGL
      layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}
