"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map } from "react-map-gl";
import {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  useControl
} from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapboxOverlay } from '@deck.gl/mapbox';

import type { MapViewState, ViewStateChangeParameters } from "@deck.gl/core";
import type { RenderPassParameters } from "@luma.gl/core";
import { FlyToInterpolator } from "deck.gl";
import {
  COUNTRY_COORDINATES,
  getGeoJsonData,
  COUNTRY_S_NOM_RANGES,
  COUNTRY_VIEW_CONFIG,
} from "./components/Links";
import { BlockProperties } from "./components/Layer";
import { GeoJsonLayer } from "@deck.gl/layers";
import BottomDrawer from "../../components/BottomDrawer";
import MySideDrawer from "./popups/SideDrawer";
import { useTheme } from "next-themes";
import type { Feature, Geometry } from "geojson";
import type { PickingInfo } from "deck.gl";
import {
  getBusChartsData,
  getCountryCapacityChartsData,
  getCountryGenerationChartsData,
  getCountryDemandChartsData,
  getCountryGenerationMixChartsData,
  getBusGenerationChartsData,
  getInstalledCapacitiesChartsData,
  getTotalDemandChartsData,
} from "./chartData";
import { WebMercatorViewport } from "@deck.gl/core";
import MapLegend from "./components/MapLegend";
import { useCountry } from "@/components/country-context";
import { Button } from "@/components/ui/button";
import { useNetworkView } from "@/components/network-view-context";
import type { ViewStateChangeEvent } from 'react-map-gl';

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: { top: number; bottom: number; left: number; right: number };
  width: number;
  height: number;
  minZoom?: number;
  maxZoom?: number;
  transitionDuration?: number;
  transitionInterpolator?: any;
}

const INITIAL_VIEW_STATE: ViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 4,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
  width: window.innerWidth,
  height: window.innerHeight,
  minZoom: 3,
  maxZoom: 20
};

const TOKEN = "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw";

const MAP_STYLE_LIGHT = "mapbox://styles/mapbox/light-v9";
const MAP_STYLE_DARK = "mapbox://styles/mapbox/dark-v9";

function normalizeSnom(
  value: number,
  country: keyof typeof COUNTRY_S_NOM_RANGES,
  zoomLevel: number
) {
  const zoomFactor = Math.pow(1.5, 7 - zoomLevel);
  const minLineWidth = 10 * zoomFactor;
  const maxLineWidth = 500 * zoomFactor;

  if (value < 1000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.2;
  } else if (value < 5000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.4;
  } else if (value < 15000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.6;
  } else if (value < 30000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.8;
  } else {
    return maxLineWidth;
  }
}

function getBusSize(country: keyof typeof COUNTRY_S_NOM_RANGES) {
  return COUNTRY_S_NOM_RANGES[country].bussize;
}

// Bus properties interface
interface BusProperties extends BlockProperties {
  Bus: string;
  v_nom: number;
  country: string;
  carrier: string;
  x: number;
  y: number;
  control: string;
  generator: string | null;
  type: string | null;
  unit: string | null;
  v_mag_pu_set: number;
  v_mag_pu_min: number;
  v_mag_pu_max: string | number;
  sub_network: string | null;
  country_code: string;
}

// Country configurations for bus sizes
export const COUNTRY_BUS_CONFIGS = {
  US: { minRadius: 1000, maxRadius: 40000, zoomBase: 1.2 },
  MX: { minRadius: 5000, maxRadius: 25000, zoomBase: 1.2 },
  BR: { minRadius: 15000, maxRadius: 35000, zoomBase: 1.2 },
  DE: { minRadius: 4000, maxRadius: 15000, zoomBase: 1.2 },
  CO: { minRadius: 5000, maxRadius: 10000, zoomBase: 1.2 },
  AU: { minRadius: 3000, maxRadius: 10000, zoomBase: 1.1 },
  IN: { minRadius: 2500, maxRadius: 20000, zoomBase: 1.2 },
  ZA: { minRadius: 5000, maxRadius: 20000, zoomBase: 1.2 },
  IT: { minRadius: 3000, maxRadius: 5000, zoomBase: 1.2 },
  NG: { minRadius: 3000, maxRadius: 5000, zoomBase: 1.2 },
} as const;

// Define render parameters interface
interface CustomRenderParameters extends RenderPassParameters {
  depthTest?: boolean;
}

function DeckGLOverlay(props: any) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function MainMap() {
  const { theme: currentTheme } = useTheme();

  const countryBus = useRef(null);
  const countryCapacity = useRef(null);
  const countryGeneration = useRef(null);
  const countryDemand = useRef(null);
  const countryGenerationMix = useRef(null);
  const busGeneration = useRef(null);
  const installedCapacities = useRef(null);
  const totalDemand = useRef(null);

  // const countries = [US_DATA, COLUMBIA_DATA, NIGERIA_DATA];
  const DeckRef = useRef(null);

  const { selectedCountry, setSelectedCountry } = useCountry();

  const [networkVeiw, setNetworkView] = useState(false);

  const [selectedPointID, setSelectedPointID] = useState<string | null>(null);
  const [hoverPointID, setHoverPointID] = useState<string | null>(null);

  const [selectedLineID, setSelectedLineID] = useState<string | null>(null);
  const [hoverLineID, setHoverLineID] = useState<string | null>(null);

  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE as ViewState);

  const [open, setOpen] = useState<boolean>(false);

  const [selectedBusData, setSelectedBusData] = useState<{
    busId: string;
    countryCode: string;
  } | null>(null);

  const [selectedLineData, setSelectedLineData] = useState<{
    busId: string;
    countryCode: string;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(4);

  const [busCapacities, setBusCapacities] = useState<Record<string, number>>(
    {}
  );

  const [isLoading, setIsLoading] = useState(true);

  const [mapWidth, setMapWidth] = useState(window.innerWidth - 384);

  const { networkView } = useNetworkView();

  const loadBusCapacities = useCallback(async (country: string) => {
    if (!country) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bustotal/${country}`);
      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid API response format");
      }

      const capacities = data.data.reduce(
        (acc: Record<string, number>, item: any) => {
          if (item.bus && typeof item.total_capacity === "number") {
            acc[item.bus] = item.total_capacity / 1000000;
          }
          return acc;
        },
        {}
      );

      setBusCapacities(capacities);
    } catch (error) {
      console.error(`Error loading bus capacities for ${country}:`, error);
      setBusCapacities({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBusCapacities(selectedCountry);
  }, [selectedCountry]);

  const calculateBusRadius = (busId: string, zoom: number) => {
    if (isLoading || !busCapacities[busId]) {
      return COUNTRY_BUS_CONFIGS[selectedCountry].minRadius;
    }

    const capacity = busCapacities[busId];
    const config = COUNTRY_BUS_CONFIGS[selectedCountry];
    const { minRadius, maxRadius, zoomBase } = config;

    // Get capacity range for current country
    const capacityValues = Object.values(busCapacities);
    const minCapacity = Math.min(...capacityValues);
    const maxCapacity = Math.max(...capacityValues);

    // Use logarithmic scale for better differentiation
    const logBase = 2;
    const logMin = Math.log(minCapacity + 1) / Math.log(logBase);
    const logMax = Math.log(maxCapacity + 1) / Math.log(logBase);
    const logCurrent = Math.log(capacity + 1) / Math.log(logBase);

    // Add dispersion factor to avoid similar sizes
    const normalizedSize = (logCurrent - logMin) / (logMax - logMin);
    const dispersedSize = Math.pow(normalizedSize, 0.4);

    // Apply base radius with non-linear scale
    const baseRadius = minRadius + (maxRadius - minRadius) * dispersedSize;

    // Adjust zoom factor
    const zoomFactor = Math.pow(zoomBase, zoom - 5);

    // Add density-based separation factor
    const numBuses = capacityValues.length;
    const densityFactor = Math.max(0.6, 1 - numBuses / 200);

    return baseRadius * zoomFactor * densityFactor;
  };

  const flyToGeometry = useCallback((info: any) => {
    const cords = info;
    setViewState(currentViewState => ({
      ...currentViewState,
      latitude: cords[1],
      longitude: cords[0],
      zoom: 5,
      minZoom: 3,
      maxZoom: 20,
      pitch: 0,
      bearing: 0,
      padding: currentViewState.padding,
      width: window.innerWidth,
      height: window.innerHeight,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: 500,
    }));
  }, []);

  useEffect(() => {
    if (!open && selectedPointID) {
      setOpen(false);
      setSelectedPointID(null);
    }
  }, [open]);

  const MakeLayers = useCallback(() => {
    if (isLoading || Object.keys(busCapacities).length === 0) {
      return [];
    }

    const links = getGeoJsonData(selectedCountry);

    return [
      new GeoJsonLayer({
        id: `Country${1}`,
        data: links.countryView,
        opacity: 1,
        stroked: true,
        filled: true,
        pickable: true,
        getLineColor: [227, 26, 28],
        getFillColor: [227, 26, 28],
        getLineWidth: 1,
        getRadius: 100,
        lineWidthScale: 20,
        parameters: {
          depthTest: false,
          blend: true,
          blendFunc: [770, 771],
        } as CustomRenderParameters,
      }),
      new GeoJsonLayer({
        id: `Linebus`,
        data: links.lines,
        opacity: 1,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 20,
        getLineColor: [227, 26, 28],
        getFillColor: [227, 26, 28],
        getLineWidth: (d) => {
          const baseWidth = normalizeSnom(
            d.properties.s_nom,
            selectedCountry,
            zoomLevel
          );

          if (selectedLineID === d.properties.Bus) {
            return baseWidth * 1.5;
          } else if (hoverLineID === d.properties.Bus) {
            return baseWidth * 1.2;
          }
          return baseWidth;
        },
        onHover: (info) => {
          setHoverLineID(info.object ? info.object.id : null);
        },
        updateTriggers: {
          getLineWidth: [selectedLineID, hoverLineID, zoomLevel],
        },
        transitions: {
          getLineWidth: 100,
        },
        parameters: {
          depthTest: false,
          blend: true,
          blendFunc: [770, 771],
        } as CustomRenderParameters,
      }),
      new GeoJsonLayer<BusProperties>({
        id: `Buses${2}`,
        data: links.buses,
        opacity: 1,
        stroked: false,
        filled: true,
        pointType: "circle",
        wireframe: true,
        pointRadiusScale: 2.0,
        getPointRadius: (d) => {
          const baseRadius = calculateBusRadius(d.properties.Bus, zoomLevel);

          if (selectedPointID === d.properties.Bus) {
            return baseRadius * 1.5;
          } else if (hoverPointID === d.properties.Bus) {
            return baseRadius * 1.3;
          }
          return baseRadius;
        },
        onClick: (info) => {
          if (!info.object) return;
          
          const busId = info.object.properties.Bus;
          if (selectedPointID === busId) {
            setSelectedPointID(null);
            setSelectedBusData(null);
            setOpen(false);
          } else {
            setSelectedPointID(busId);
            setSelectedBusData({
              busId: busId,
              countryCode: selectedCountry,
            });
            flyToGeometry(info.object.geometry.coordinates);
            setOpen(true);
          }
        },
        onHover: (info) => {
          setHoverPointID(info.object ? info.object.id : null);
        },
        getFillColor: [72, 123, 182],
        pickable: true,
        updateTriggers: {
          getPointRadius: [
            selectedPointID,
            hoverPointID,
            zoomLevel,
            busCapacities,
            isLoading,
          ],
        },
        transitions: {
          getPointRadius: 200,
        },
        autoHighlight: true,
        parameters: {
          depthTest: false,
          blend: true,
          blendFunc: [770, 771],
        } as CustomRenderParameters,
      }),
    ];
  }, [selectedCountry, busCapacities, isLoading, zoomLevel]);

  const visibleLayers = (networkView: boolean) => {
    const allLayers = MakeLayers();
    return networkView ? allLayers.slice(1) : [allLayers[0]];
  };

  // Función para manejar la transición entre vistas
  const handleViewTransition = useCallback((isNetworkView: boolean) => {
    const countryCoordinates = COUNTRY_COORDINATES[selectedCountry];
    const viewConfig = COUNTRY_VIEW_CONFIG[selectedCountry];

    if (isNetworkView) {
      setViewState(currentViewState => ({
        ...currentViewState,
        latitude: countryCoordinates[0],
        longitude: countryCoordinates[1],
        zoom: viewConfig.zoom,
        padding: currentViewState.padding,
        width: window.innerWidth,
        height: window.innerHeight,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 2000
      }));
    } else {
      // Vista de país completo
      setViewState(currentViewState => ({
        ...currentViewState,
        latitude: countryCoordinates[0],
        longitude: countryCoordinates[1],
        zoom: viewConfig.zoom - 1, 
        padding: currentViewState.padding,
        width: window.innerWidth,
        height: window.innerHeight,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 2000
      }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    handleViewTransition(networkView);
  }, [networkView, handleViewTransition]);

  useEffect(() => {
    const countryCoordinates = COUNTRY_COORDINATES[selectedCountry];
    const viewConfig = COUNTRY_VIEW_CONFIG[selectedCountry];

    setViewState(currentViewState => ({
      ...currentViewState,
      latitude: countryCoordinates[0],
      longitude: countryCoordinates[1],
      zoom: viewConfig.zoom,
      padding: currentViewState.padding,
      width: window.innerWidth,
      height: window.innerHeight,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
      transitionDuration: 1500,
    }));

    loadBusCapacities(selectedCountry);
    getCountryCapacityChartsData(selectedCountry, countryCapacity);
    getCountryGenerationChartsData(selectedCountry, countryGeneration);
    getCountryDemandChartsData(selectedCountry, countryDemand);
    getCountryGenerationMixChartsData(selectedCountry, countryGenerationMix);
    getBusGenerationChartsData(selectedCountry, busGeneration);
    getBusChartsData(selectedCountry, countryBus);
    getInstalledCapacitiesChartsData(selectedCountry, installedCapacities);
    getTotalDemandChartsData(selectedCountry, totalDemand);
  }, [selectedCountry, loadBusCapacities]);

  const onViewStateChange = useCallback(
    (evt: ViewStateChangeEvent) => {
      if (!evt.viewState) return;
      
      setViewState({
        ...evt.viewState,
        width: window.innerWidth,
        height: window.innerHeight,
        padding: viewState.padding,
        minZoom: viewState.minZoom,
        maxZoom: viewState.maxZoom,
        transitionInterpolator: viewState.transitionInterpolator,
        transitionDuration: viewState.transitionDuration
      });
      
      setZoomLevel(evt.viewState.zoom);
    },
    []
  );

  useEffect(() => {
    const handleResize = () => {
      setMapWidth(window.innerWidth - 384);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div 
        className="ml-96"
        onContextMenu={(evt) => evt.preventDefault()}
      >
        <Map
          reuseMaps
          mapStyle={currentTheme === "light" ? MAP_STYLE_LIGHT : MAP_STYLE_DARK}
          mapboxAccessToken={TOKEN}
          viewState={viewState}
          onMove={onViewStateChange}
          style={{ width: '100%', height: '100vh' }}
        >
          <DeckGLOverlay
            layers={visibleLayers(networkView)}
            getCursor={({isDragging}: {isDragging: boolean}) => isDragging ? 'grabbing' : 'grab'}
          />
          <NavigationControl 
            position="top-right" 
            showCompass={false}
            visualizePitch={true}
          />
          <FullscreenControl position="top-right" />
          <ScaleControl position="bottom-right" />
        </Map>
      </div>
      <MySideDrawer
        open={open}
        setOpen={setOpen}
        side={"right"}
        data={selectedBusData}
      />
    </>
  );
}
