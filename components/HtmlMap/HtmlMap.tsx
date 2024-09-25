"use client";

import React, { useEffect, useState, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { US_DATA, COLUMBIA_DATA, NIGERIA_DATA } from "./Links";
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
  const [data, setData] = useState<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      initialized.current = true;
      try {
        // Start the fetch request
        const response = await fetch(US_DATA.buses); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Parse JSON from the response
        console.log(result);

        setData(result);
      } catch (error) {}
    };

    if (!initialized.current) {
      fetchData();
    }
  }, []);

  function makemarkers() {
    const t = data.features.map((element: any) => {
      console.log(element.geometry.coordinates[0]); //long
      console.log(element.geometry.coordinates[1]);

      return (
        <Marker
          longitude={element.geometry.coordinates[0]}
          latitude={element.geometry.coordinates[1]}
          anchor="center"
          style={{
            width: "60px",
            height: "60px",
            zIndex: 100,
          }}
          scale={3}
          rotationAlignment={"map"}
          pitchAlignment="map"
          onClick={() => {
            console.log("i clicked");
          }}
        >
          <SimplePie />
        </Marker>
      );
    });
    return t;
  }

  return (
    <DeckGL
      // layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <Map
        reuseMaps
        mapStyle={"mapbox://styles/mapbox/light-v9"}
        mapboxAccessToken={TOKEN}
      >
        {data ? makemarkers() : <></>}
      </Map>
    </DeckGL>
  );
}
