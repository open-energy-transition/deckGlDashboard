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
    is_empty_data: boolean;
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
  if (!baseUrl) {
    throw new Error('No base URL provided for regions data');
  }

  const fullUrl = new URL(baseUrl, window.location.origin);
  fullUrl.searchParams.set("generatorType", regionGeneratorValue);
  fullUrl.searchParams.set("simplification", "0.01");
  fullUrl.searchParams.set("pageSize", "10000");
  fullUrl.searchParams.set("year", "2021");
  fullUrl.searchParams.set("parameter", regionParamValue);

  const layer = new GeoJsonLayer({
    id: `${selectedCountry}_${regionGeneratorValue}_${regionParamValue}_${timestamp}`,
    data: fullUrl.toString(),
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [50, 50, 50, 200],
    getFillColor: (d: Feature<Geometry, GeoJsonProperties>) => {
      if (!d.properties) return [128, 128, 128, 50];
      if (d.properties.is_empty_data) return [128, 128, 128, 50];
      
      let value;
      switch(regionParamValue) {
        case 'cf':
          value = d.properties.cf;
          break;
        case 'crt':
          value = d.properties.crt;
          break;
        case 'usdpt':
          value = d.properties.usdpt;
          break;
        default:
          value = d.properties.cf;
      }

      if (value === undefined || value === null || isNaN(value)) {
        return [128, 128, 128, 50];
      }

      const maxValue = 99;
      const normalizedValue = Math.min(value / maxValue, 1);
      const [r, g, b, baseAlpha] = regionalGeneratorTypes[regionGeneratorValue];
      const alpha = Math.floor(normalizedValue * 155 + 100);

      return [r, g, b, alpha];
    },
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
    getPointRadius: 100,
    parameters: {
      depthTest: false,
    }
  });

  return layer;
};

export default RegionLayer;
