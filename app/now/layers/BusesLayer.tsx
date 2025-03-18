"use client";
import {
  COUNTRY_BUS_CONFIGS,
  getGeoJsonData,
  COUNTRY_BUS_RANGES,
} from "@/utilities/CountryConfig/Link";
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { FlyToInterpolator, GeoJsonLayer } from "deck.gl";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { RenderPassParameters } from "@luma.gl/core";
import { useCountry } from "@/components/country-context";

interface CustomRenderParameters extends RenderPassParameters {
  depthTest?: boolean;
}

interface BusesLayerProps {
  setHoverPointID: (id: string | null) => void;
  position: { x: number; y: number };
  zoomLevel: number;
  busCapacities: Record<string, number>;
  isLoading: boolean;
  selectedCountry?: string;
  breaks?: Array<{
    group: number;
    min: number;
    max: number;
  }>;
}

interface BusFeature extends Feature<Geometry> {
  properties: {
    Bus: string;
    capacity?: number;
    [key: string]: any;
  };
}

interface PickingInfo {
  index: number;
  picked: boolean;
  object?: BusFeature;
  layer: any;
  x: number;
  y: number;
}

const calculateBusRadius = (
  feature: BusFeature,
  busCapacities: Record<string, number>,
  selectedCountry: string | undefined,
  isLoading: boolean,
  isHovered: boolean,
  breaks?: Array<{group: number, min: number, max: number}>,
  zoomLevel?: number
): number => {
  const busId = feature.properties.Bus;
  const capacity = busCapacities[busId];

  if (!selectedCountry || isLoading || !capacity || !breaks) {
    return 10000 / (Math.pow(1.5, zoomLevel || 0));
  }

  const group = breaks.find(b => capacity >= b.min && capacity <= b.max);
  const minSize = 100000;
  const maxSize = 2000000;
  const sizeStep = (maxSize - minSize) / (breaks.length - 1);
  
  let radius = minSize + (group ? (group.group - 1) * sizeStep : 0);
  const scaleFactor = 1 / (Math.pow(1.5, zoomLevel || 0));
  radius = radius * scaleFactor;

  if (isHovered) {
    radius *= 3;
  }

  return radius;
};

const getFillColor = (
  feature: BusFeature,
  busCapacities: Record<string, number>,
  isLoading: boolean,
  isHovered: boolean,
  breaks?: Array<{group: number, min: number, max: number}>
): [number, number, number, number] => {
  const busId = feature.properties.Bus;
  const capacity = busCapacities[busId];

  if (isLoading || !capacity || !breaks) {
    return isHovered ? [150, 180, 160, 180] : [124, 152, 133, 100];
  }

  const group = breaks.find(b => capacity >= b.min && capacity <= b.max);
  const baseColor: [number, number, number] = [124, 152, 133];
  const baseAlpha = 100;
  const alphaStep = 30;
  
  const alpha = isHovered ? 255 : baseAlpha + (group ? (group.group - 1) * alphaStep : 0);
  
  return [...baseColor, alpha];
};

function createBusesLayer({
  setHoverPointID,
  position,
  zoomLevel,
  busCapacities,
  isLoading,
  selectedCountry,
  breaks,
}: BusesLayerProps) {
  if (typeof window === 'undefined') {
    return null;
  }

  const links = getGeoJsonData(selectedCountry || "US");
  const timestamp = Date.now() + Math.random();

  return new GeoJsonLayer({
    id: `Buses_${selectedCountry}_${timestamp}`,
    data: links.buses,
    opacity: 1,
    stroked: true,
    filled: true,
    pointType: "circle",
    wireframe: true,
    radiusUnits: 'meters',
    pointRadiusScale: 1.0,
    getPointRadius: ((d: BusFeature) => {
      return calculateBusRadius(
        d, 
        busCapacities, 
        selectedCountry, 
        isLoading,
        false,
        breaks,
        zoomLevel
      );
    }) as any,
    getFillColor: ((d: BusFeature) => {
      return getFillColor(
        d, 
        busCapacities, 
        isLoading,
        false,
        breaks
      );
    }) as any,
    getLineColor: [124, 152, 133, 255],
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    lineWidthScale: 1,
    pickable: true,
    autoHighlight: true,
    highlightColor: [200, 200, 200, 100],
    onHover: (info: PickingInfo) => {
      position.x = info.x || 0;
      position.y = info.y || 0;
      setHoverPointID(info.object ? info.object.properties.Bus : null);
    },
    updateTriggers: {
      getPointRadius: [busCapacities, isLoading, selectedCountry, breaks, zoomLevel],
      getFillColor: [busCapacities, isLoading, breaks],
    },
    transitions: {
      getPointRadius: 300,
      getFillColor: 300,
    },
    parameters: {
      depthTest: false,
    } as CustomRenderParameters,
  });
}

export default createBusesLayer;

