import { getGeoJsonData } from "@/utilities/CountryConfig/Link";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import React, { useCallback, useRef } from "react";
import { Map } from "react-map-gl/maplibre";
import type { MapViewState, ViewStateChangeParameters } from "@deck.gl/core";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";
import { useCountry } from "@/components/country-context";

const RegionLayer = () => {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const links = getGeoJsonData(selectedCountry);
  const polygon = `${links.regions_2021}&simplification=0.01&pageSize=10000&generatorType=ror`;

  return new GeoJsonLayer({
    id: `Country_regions${1}`,
    data: polygon,
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [228, 30, 60],
    getFillColor: (d) => {
      const [r, g, b] = regionalGeneratorTypes.ror;
      return [r, g, b, 2.5 * d.properties.cf];
    },
    getLineWidth: 100,
    getRadius: 100,
    lineWidthScale: 20,
  });
};

export default RegionLayer;
