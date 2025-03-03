"use client";
import { GeoJsonLayer } from "deck.gl";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";
interface RegionLayerProps {
  regionGeneratorValue: keyof typeof regionalGeneratorTypes;
  regionParamValue: string;
  links: any;
}

const RegionLayer = ({
  regionGeneratorValue,
  regionParamValue,
  links,
}: RegionLayerProps) => {
  const polygon = `${links.regions_2021}&simplification=0.01&pageSize=10000&generatorType=${regionGeneratorValue}`;

  return new GeoJsonLayer({
    id: `Country_regions${regionGeneratorValue}_${regionParamValue}_${Date.now()}`,
    data: polygon,
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [228, 30, 60],
    getFillColor: (d) => {
      const [r, g, b] = regionalGeneratorTypes[regionGeneratorValue];
      return [r, g, b, 2.5 * d.properties[regionParamValue]];
    },
    getLineWidth: 100,
    updateTriggers: {
      getFillColor: [regionGeneratorValue, regionParamValue, links, polygon],
    },
    getRadius: 100,
    lineWidthScale: 20,
  });
};

export default RegionLayer;
