"use client";
import { getGeoJsonData } from "@/utilities/CountryConfig/Link";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import React, { useCallback, useRef } from "react";
import { Map } from "react-map-gl/maplibre";
import type { MapViewState, ViewStateChangeParameters } from "@deck.gl/core";
import RegionLayer from "./popups/RegionLayer";

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 4,
  minZoom: 3,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const Page = () => {
  const DeckRef = useRef(null);

  const MakeLayers = useCallback(() => {
    const links = getGeoJsonData("US");
    const polygon = `${links.regions_2021}&simplification=0.01&pageSize=10000`;

    return [
      //   new GeoJsonLayer({
      //     id: `Country${1}`,
      //     data: polygon,
      //     opacity: 1,
      //     stroked: true,
      //     filled: true,
      //     pickable: true,
      //     getLineColor: [228, 30, 60, 150],
      //     getFillColor: [215, 229, 190],

      //     getLineWidth: 200,
      //     getRadius: 100,
      //     lineWidthScale: 20,
      //     onHover: (info) => {
      //       console.log(info);
      //     },
      //   }),
      RegionLayer(),
      new GeoJsonLayer({
        id: `Linebus`,
        data: links.lines,
        // opacity: 0.8,
        stroked: true,
        filled: true,
        pickable: false,
        lineWidthScale: 200,
        getLineColor: [228, 30, 60, 150], // Last value is alpha (0-255)
        getFillColor: [228, 30, 60, 150], // Last value is alpha (0-255)
        getLineWidth: 20,
        // onHover: (info) => {
        //   setHoverLineID(info.object ? info.object.id : null);
        // },
      }),
      new GeoJsonLayer({
        id: `Buses${2}`,
        data: links.buses,
        opacity: 1,
        stroked: true,
        filled: true,
        pointType: "circle",
        wireframe: true,
        pointRadiusScale: 20.0,
        getPointRadius: 2000,

        getLineColor: [124, 152, 133],
        getFillColor: [124, 152, 133],
        pickable: true,
      }),
    ];
  }, []);

  return (
    <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
      <DeckGL
        layers={MakeLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        ref={DeckRef}
        // onViewStateChange={onViewStateChange as any}
      >
        <Map reuseMaps mapStyle={MAP_STYLE_DARK} styleDiffing={false} />
      </DeckGL>
    </div>
  );
};

export default Page;
