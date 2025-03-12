"use client";
import { GeoJsonLayer } from "deck.gl";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";
import { Feature, Geometry, GeoJsonProperties } from "geojson";

interface RegionLayerProps {
  regionGeneratorValue: keyof typeof regionalGeneratorTypes;
  regionParamValue: string;
  links: any;
  selectedCountry: string;
}

interface GeoJsonFeature {
  properties: {
    carrier: string;
    [key: string]: any;
  };
}

const RegionLayer = ({
  regionGeneratorValue,
  regionParamValue,
  links,
  selectedCountry,
}: RegionLayerProps): GeoJsonLayer => {
  const timestamp = Date.now() + Math.random();

  // Construct URL with proper query parameters
  const baseUrl = links.regions_2021;
  const fullUrl = new URL(baseUrl, window.location.origin);
  fullUrl.searchParams.set("generatorType", regionGeneratorValue);
  fullUrl.searchParams.set("simplification", "0.01");
  fullUrl.searchParams.set("pageSize", "10000");
  fullUrl.searchParams.set("year", "2021");

  const getFillColor = (
    d: Feature<Geometry>,
    { data }: { data: { features: Feature<Geometry>[] } }
  ): [number, number, number, number] => {
    if (!d.properties) return [0, 0, 0, 0];

    const value = d.properties[regionParamValue];
    if (value === undefined || value === null) return [0, 0, 0, 0];

    const alpha = Math.floor((value / 99) * 255);
    return [
      regionalGeneratorTypes[regionGeneratorValue][0],
      regionalGeneratorTypes[regionGeneratorValue][1],
      regionalGeneratorTypes[regionGeneratorValue][2],
      alpha,
    ];
  };

  return new GeoJsonLayer({
    id: `${selectedCountry}_${regionGeneratorValue}_${regionParamValue}_${timestamp}`,
    data: fullUrl.toString(),

    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [50, 50, 50, 200] as [number, number, number, number],
    getFillColor: getFillColor as unknown as [number, number, number, number],
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    lineWidthScale: 1,
    updateTriggers: {
      getFillColor: [
        regionGeneratorValue,
        regionParamValue,
        links,
        selectedCountry,
      ],
    },
    getRadius: 100,
    parameters: {
      depthTest: false,
    },
  });
};

export default RegionLayer;
