"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  use,
  useCallback,
  useMemo,
} from "react";
import EarthLightUrl from "../../public/earth-night-light.jpg";
import LightSkyUrl from "../../public/night-sky-light.png";
import dynamic from "next/dynamic";
import {
  getGeoJsonData,
  COUNTRY_COORDINATES,
  COUNTRY_NAMES,
  COUNTRY_COLORS,
} from "@/utilities/CountryConfig/Link";
import useSWR from "swr";
import { useTheme } from "next-themes";
import GlobeNav from "./popups/LandingGlobeNav";
import { useCountry } from "@/components/country-context";
import RightDrawer from "./popups/RightDrawer";
import R3fGlobe from "r3f-globe";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Color } from "three";
// import ThreeGlobe from "three-globe";
// import * as THREE from "three";
// // @ts-expect-error scscs
// import TrackballControls from "three-trackballcontrols";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface GeoFeature {
  id: string;
  properties: {
    ADMIN?: string;
    name?: string;
  };
  geometry?: any;
}

interface FetcherResponse {
  features?: GeoFeature[];
  [key: string]: any;
}

const fetcher = (url: string): Promise<FetcherResponse> =>
  fetch(url).then((res) => res.json());

const GlobeViz = () => {
  const { selectedCountry, setSelectedCountry } = useCountry();

  const { theme, setTheme } = useTheme();

  const endpoints = Object.keys(COUNTRY_COORDINATES).map(
    (country) => getGeoJsonData(country).countryView
  );

  const { data, error, isLoading } = useSWR(endpoints, async (urls) => {
    const responses = await Promise.all(urls.map((url) => fetcher(url)));
    return responses.reduce((acc, curr) => {
      if (curr.features) {
        acc.features = [...(acc.features || []), ...curr.features];
      }
      return acc;
    }, {} as FetcherResponse);
  });

  const getPolygonColor = (d: any) => {
    const countryCode = d.id
      ?.split("_")[0]
      ?.toLowerCase() as keyof typeof COUNTRY_COLORS;
    return COUNTRY_COLORS[countryCode] || "#cccccc";
  };

  const getPolygonSideColor = (d: any) => {
    const countryCode = d.id?.split("_")[0]?.toLowerCase();
    const baseColor =
      COUNTRY_COLORS[countryCode as keyof typeof COUNTRY_COLORS] || "#cccccc";
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  };

  return (
    <R3fGlobe
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      globeImageUrl={
        theme === "dark"
          ? "//unpkg.com/three-globe/example/img/earth-dark.jpg"
          : EarthLightUrl.src
      }
      polygonsData={data?.features || []}
      polygonCapColor={getPolygonColor}
      polygonSideColor={getPolygonSideColor}
      polygonStrokeColor={getPolygonColor}
      polygonAltitude={(d: any) => {
        const countryCode = d.id?.split("_")[0]?.substring(0, 2).toLowerCase();
        if (selectedCountry === countryCode.toUpperCase()) {
          return 0.1;
        }

        return 0.01;
      }}
      onHover={useCallback((...args: unknown[]) => {
        console.log("hover", args);
      }, [])}
      onClick={useCallback((...args: unknown[]) => {
        const countryCode = (args[1] as { id: string }).id
          ?.split("_")[0]
          ?.substring(0, 2)
          .toLowerCase();
        console.log("polygon clicked", countryCode.toUpperCase());
        setSelectedCountry(
          countryCode.toUpperCase() as
            | "AU"
            | "BR"
            | "CO"
            | "DE"
            | "IN"
            | "IT"
            | "MX"
            | "NG"
            | "US"
            | "ZA"
        );
        console.log("click", ...args);
      }, [])}
    />
  );
};

const Page = () => {
  // const bgColor = new Color().setHSL(140 / 360, 0.13, 0.95);
  const bgColor = new Color().setHSL(240 / 360, 0.13, 0.08);
  return (
    <>
      <GlobeNav />
      <RightDrawer />
      <div style={{ height: window.innerHeight }}>
        <Canvas camera={useMemo(() => ({ position: [0, 0, 250] }), [])}>
          <OrbitControls
            minDistance={101}
            maxDistance={1e4}
            dampingFactor={0.1}
            zoomSpeed={0.3}
            rotateSpeed={0.3}
          />
          <color attach="background" args={[0, 0, 0]} />
          <ambientLight intensity={Math.PI} />
          <directionalLight intensity={0.6 * Math.PI} />
          <GlobeViz />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          {/* <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} /> */}
        </Canvas>
      </div>
    </>
  );
};

export default Page;
