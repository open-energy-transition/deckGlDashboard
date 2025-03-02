"use client";
import { GeoJsonLayer } from "@deck.gl/layers";
import { getGeoJsonData, normalizeSnom } from "@/utilities/CountryConfig/Link";
import type { RenderPassParameters } from "@luma.gl/core";
import { useCountry } from "@/components/country-context";

interface CustomRenderParameters extends RenderPassParameters {
  depthTest?: boolean;
}

interface LinesLayerProps {
  zoomLevel: number;
}

const LinesLayer = ({ zoomLevel }: LinesLayerProps) => {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const links = getGeoJsonData(selectedCountry);

  return new GeoJsonLayer({
    id: `Linebus`,
    data: links.lines,
    // opacity: 0.8,
    stroked: true,
    filled: true,
    pickable: false,
    lineWidthScale: 20,
    getLineColor: [228, 30, 60, 150],
    getFillColor: [228, 30, 60, 150],
    getLineWidth: (d: any) => {
      const baseWidth = normalizeSnom(
        d.properties.s_nom,
        selectedCountry,
        zoomLevel
      );
      return baseWidth;
    },
    updateTriggers: {
      getLineWidth: [zoomLevel],
    },
    transitions: {
      getLineWidth: 100,
    },
    parameters: {
      depthTest: false,
    } as CustomRenderParameters,
  });
};

export default LinesLayer;
