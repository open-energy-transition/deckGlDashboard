import { getGeoJsonData } from "@/utilities/CountryConfig/Link";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import React, { useCallback, useRef } from "react";
import { Map } from "react-map-gl/maplibre";
import type { MapViewState, ViewStateChangeParameters } from "@deck.gl/core";

const RegionLayer = () => {
  const links = getGeoJsonData("US");
  const polygon = `${links.regions_2021}&simplification=0.01&pageSize=10000&generatorType=ror`;

  return new GeoJsonLayer({
    id: `Country${1}`,
    data: polygon,
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [228, 30, 60],
    getFillColor: (d) => {
      console.log("d", d);
      return [215, 229, 190, 2.5 * d.properties.crt];
    },

    getLineWidth: 200,
    getRadius: 100,
    lineWidthScale: 20,
    onClick: (info) => {
      console.log(info);
    },
  });
};

export default RegionLayer;
