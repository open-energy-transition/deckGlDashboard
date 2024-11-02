"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { FlyToInterpolator } from "deck.gl";
import { COUNTRY_COORDINATES, getGeoJsonData } from "./components/Links";
import { BlockProperties } from "./components/Layer";
import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import BottomDrawer from "./popups/BottomDrawer";
import MySideDrawer from "./popups/SideDrawer";
import { useTheme } from "next-themes";
import { Feature, Geometry } from "geojson";
import type { PickingInfo } from "deck.gl";
import CountrySelect from "./components/CountrySelect";
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
import { count } from "console";
import { get } from "http";
import { link } from "fs";
import { MyCustomLayers } from "./components/Layer";

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 4,
  minZoom: 3,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function MainMap() {
  const { theme } = useTheme();

  const countryLevelChartData = useRef(null);
  const busLevelChartData = useRef(null);
  const lineLevelChartData = useRef(null);

  // const countries = [US_DATA, COLUMBIA_DATA, NIGERIA_DATA];
  const DeckRef = useRef(null);

  const [selectedCountry, setSelectedCountry] =
    useState<keyof typeof COUNTRY_COORDINATES>("US");

  const [selectedPointID, setSelectedPointID] = useState<string | null>(null);
  const [hoverPointID, setHoverPointID] = useState<string | null>(null);

  const [selectedLineID, setSelectedLineID] = useState<string | null>(null);
  const [hoverLineID, setHoverLineID] = useState<string | null>(null);

  const [initialViewState, setInitialViewState] =
    useState<MapViewState>(INITIAL_VIEW_STATE);

  const [lineOpen, setLineOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const flyToGeometry = useCallback((info: any) => {
    const cords = info;
    // console.log(cords);
    setInitialViewState({
      latitude: cords[1],
      longitude: cords[0],
      zoom: 5,
      minZoom: 3,
      maxZoom: 20,
      pitch: 0,
      bearing: 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: 500,
    });
  }, []);

  useEffect(() => {
    console.log(DeckRef.current);
  }, []);

  useEffect(() => {
    if (selectedPointID) {
    }
  }, [selectedPointID]);

  useEffect(() => {
    if (!lineOpen && selectedLineID) {
      setLineOpen(false);
      setSelectedLineID(null);
    }
  }, [lineOpen]);

  useEffect(() => {
    if (!open && selectedPointID) {
      setOpen(false);
      setSelectedPointID(null);
    }
  }, [open]);

  const MakeLayers = useCallback(() => {
    const links = getGeoJsonData(selectedCountry);

    const temp = [
      new GeoJsonLayer({
        id: `Linesus`,
        data: links.lines,
        opacity: 0.8,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 22,
        getLineColor: [227, 26, 28],
        getFillColor: [227, 26, 28],
        getLineWidth: (d) => {
          // console.log("d", d);
          return d.properties.s_nom / 20;
          // write a function to normalize line and use from links min and max line values
        },
        onClick: (info, e) => {
          e.stopPropagation();
          const id = info.object.id;
          if (selectedLineID === id) {
            setSelectedLineID(null);
            setLineOpen(false);
          } else {
            setSelectedLineID(id);
            flyToGeometry(info.coordinate);
            setLineOpen(true);
          }
        },
        onHover: (info, e) => {
          if (info.object) {
            const id = info.object.id;
            setHoverLineID(id);
          } else {
            setHoverLineID(null);
          }
        },
        updateTriggers: {
          getLineWidth: [selectedLineID, hoverLineID],
        },
        transitions: {
          getLineWidth: 100,
        },
        autoHighlight: true,
        parameters: {
          depthTest: false,
        },
      }),
      new GeoJsonLayer<BlockProperties>({
        id: `Buses${2}`,
        data: links.buses,
        opacity: 1,
        stroked: false,
        filled: true,
        pointType: "circle",
        wireframe: true,
        getPointRadius: (d) => {
          if (selectedPointID === d.id) {
            return 1100;
          } else if (hoverPointID === d.id) {
            return 750;
          } else {
            return 500;
          }
        },
        pointRadiusScale: 70,
        onClick: (info, e) => {
          e.stopPropagation();
          const id = info.object.id;
          if (selectedPointID === id) {
            setSelectedPointID(null);
            setOpen(false);
          } else {
            setSelectedPointID(id);
            flyToGeometry(info.object.geometry.coordinates);
            setOpen(true);
          }
        },
        onHover: (info, e) => {
          if (info.object) {
            const id = info.object.id;
            setHoverPointID(id);
          } else {
            setHoverPointID(null);
          }
        },
        getFillColor: [72, 123, 182],
        pickable: true,
        updateTriggers: {
          getPointRadius: [selectedPointID, hoverPointID],
        },
        transitions: {
          getPointRadius: 80,
        },
        autoHighlight: true,
        parameters: {
          depthTest: false,
        },
      }),
    ];

    return temp;
  }, [selectedCountry]);

  useEffect(() => {
    const countryCoordinates = COUNTRY_COORDINATES[selectedCountry] as [
      number,
      number
    ];
    flyToGeometry([countryCoordinates[1], countryCoordinates[0]]);
    getBusChartsData(selectedCountry);
    getCountryCapacityChartsData(selectedCountry);
    getCountryGenerationChartsData(selectedCountry);
    getCountryDemandChartsData(selectedCountry);
    getCountryGenerationMixChartsData(selectedCountry);
    getBusGenerationChartsData(selectedCountry);
    getInstalledCapacitiesChartsData(selectedCountry);
    getTotalDemandChartsData(selectedCountry);
  }, [selectedCountry]);

  // function onClickLine() {}
  // function onHoverLine() {}
  // function getLineWidth() {}

  // layers.push(temp[1]);
  // layers.push(temp[0]);

  // const layers = MyCustomLayers({
  //   selectedCountry,
  //   setSelectedCountry,
  //   setSelectedPointID,
  //   setHoverPointID,
  //   setSelectedLineID,
  //   setHoverLineID,
  //   setLineOpen,
  //   setOpen,
  //   selectedPointID,
  //   hoverPointID,
  //   selectedLineID,
  //   hoverLineID,
  // });

  return (
    <>
      <div onContextMenu={(evt) => evt.preventDefault()}>
        <DeckGL
          layers={MakeLayers()}
          // layers={MyCustomLayers()}
          // layers={temp}
          initialViewState={initialViewState}
          controller={true}
          ref={DeckRef}
        >
          <Map
            reuseMaps
            mapStyle={theme === "light" ? MAP_STYLE_LIGHT : MAP_STYLE_DARK}
          />
        </DeckGL>
      </div>
      <BottomDrawer selectedCountry={selectedCountry} />
      <MySideDrawer open={open} setOpen={setOpen} side={"right"} data={"Bus"} />
      <MySideDrawer
        open={lineOpen}
        setOpen={setLineOpen}
        side={"left"}
        data={"Line"}
      />
      <CountrySelect
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />
    </>
  );
}
