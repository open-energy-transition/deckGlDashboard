"use client";

import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { MyCustomLayers } from "./Layer";
import { US_DATA, COLUMBIA_DATA, NIGERIA_DATA } from "./Links";
import PieDonut from "../Charts/PieDonut";
import { Pie, Label, PieChart } from "recharts";
import SimplePie from "./SimplePie";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN =
  "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw";

// Source data GeoJSON
const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json"; // eslint-disable-line

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 5,
  minZoom: 3,
  maxZoom: 10,
  pitch: 30,
  bearing: 0,
};

const MAP_STYLE =
  // "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function HtmlMap({
  mapStyle = MAP_STYLE,
}: {
  mapStyle?: string;
}) {
  const countries = [US_DATA, COLUMBIA_DATA, NIGERIA_DATA];

  const [selectedLineIds, setSelectedLineIds] = useState([]);

  useEffect(() => {
    console.log(selectedLineIds);
  }, [selectedLineIds]);

  const handleLineClick = () => {
    // const clickedFeatureId = info.object?.properties?.id;
    // if (clickedFeatureId) {
    //   setSelectedLineIds([clickedFeatureId]); // For multiple selections, adjust accordingly
    // }
    console.log("wegvegv");
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
      <Map
        reuseMaps
        mapStyle={"mapbox://styles/mapbox/light-v9"}
        mapboxAccessToken={TOKEN}
      >
        <Marker
          longitude={-123.13}
          latitude={49.254}
          anchor="center"
          style={{
            // width: "20px",
            // height: "0px",
            zIndex: 100,
          }}
          scale={0.5}
          rotationAlignment={"map"}
          pitchAlignment="map"
        >
          <SimplePie />

          {/* <div className="bg-slate-500 w-52 h-52 z-50"></div> */}
        </Marker>
      </Map>
    </DeckGL>
  );
}
