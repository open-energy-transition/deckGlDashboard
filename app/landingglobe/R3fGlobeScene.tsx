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
import MainPageNav from "./popups/LandingGlobeNav";
import { useCountry } from "@/components/country-context";
import { GlobeMethods } from "r3f-globe";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Box,
  CameraControls,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { Color, Vector3 } from "three";
import GlobeOnly from "./JustGlobe";
import ElectricityPriceComponent from "./popups/ElectricityPriceComponent";
import { get } from "http";

// const R3fGlobe = dynamic(() => import("r3f-globe"), { ssr: false });

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
  const { theme } = useTheme();
  const globeRef = useRef<GlobeMethods>(null);
  const cameraRef = useRef<any>(null);

  const [hoveredCountry, setHoveredCountry] = useState<"in" | "out" | "null">(
    "null"
  );

  const [position, setPosition] = useState<Vector3>(new Vector3(60, 60, 60));

  const [globeReady, setGlobeReady] = useState(false);

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

  const getPolygonColor = useCallback(
    (d: any) => {
      const countryCode = d.id
        ?.split("_")[0]
        ?.toLowerCase() as keyof typeof COUNTRY_COLORS;
      if (selectedCountry === countryCode.toUpperCase()) {
        return "#E41E3C";
      }
      if (hoveredCountry === countryCode.toUpperCase()) {
        return "#D7E5A0";
      }
      return "#7C9885";
      // return COUNTRY_COLORS[countryCode] || "#cccccc";
    },
    [selectedCountry, hoveredCountry]
  );

  const getPolygonAltitude = useCallback(
    (d: any) => {
      const countryCode = d.id
        ?.split("_")[0]
        ?.toLowerCase() as keyof typeof COUNTRY_COLORS;
      if (selectedCountry === countryCode.toUpperCase()) {
        return 0.04;
      }
      if (hoveredCountry === countryCode.toUpperCase()) {
        return 0.02;
      }
      return 0.01;
      // return COUNTRY_COLORS[countryCode] || "#cccccc";
    },
    [selectedCountry, hoveredCountry]
  );

  const getPolygonSideColor = useCallback(
    (d: any) => {
      const countryCode = d.id?.split("_")[0]?.toLowerCase();
      let baseColor = "#7C9885";
      if (selectedCountry === countryCode.toUpperCase()) {
        baseColor = "#E41E3C";
      } else if (hoveredCountry === countryCode.toUpperCase()) {
        baseColor = "#D7E5A0";
      }
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.3)`;
    },
    [selectedCountry, hoveredCountry]
  );

  const handleHover = useCallback((...args: unknown[]) => {
    if (args.length < 2) {
      setHoveredCountry("null");
      return;
    }
    if (args[0] === "globe") {
      setHoveredCountry("null");
      return;
    }
    if (args[0] === "polygon") {
      const polygonData = args[1] as { id?: string };
      if (!polygonData.id) return;

      const countryCode = polygonData.id
        .split("_")[0]
        ?.substring(0, 2)
        ?.toLowerCase();

      if (!countryCode) return;

      setHoveredCountry(countryCode.toUpperCase() as "in" | "out");
    }
  }, []);

  const handleClick = useCallback(
    (...args: unknown[]) => {
      if (args.length < 2) {
        return;
      }

      const secondArg = args[1];
      if (!secondArg || typeof secondArg !== "object" || secondArg === null)
        return;

      const polygonData = secondArg as { id?: string };
      if (!polygonData.id) return;

      const countryCode = polygonData.id
        .split("_")[0]
        ?.substring(0, 2)
        ?.toLowerCase();

      if (!countryCode) return;

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
    },
    [setSelectedCountry]
  );

  useEffect(() => {
    if (globeReady && globeRef.current) {
      console.log("globeRef.current", globeRef.current);
      const t = globeRef.current.getCoords(
        COUNTRY_COORDINATES[selectedCountry][0],
        COUNTRY_COORDINATES[selectedCountry][1],
        1
      );
      const vec2 = new Vector3(t.x, t.y, t.z);
      setPosition(new Vector3(t.x, t.y, t.z));
      cameraRef.current.setLookAt(vec2.x, vec2.y, vec2.z, 0, 0, 0, true);
    }
  }, [selectedCountry]);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 250] }}>
        <CameraControls ref={cameraRef} />
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
        <GlobeOnly
          ref={globeRef}
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
          polygonAltitude={getPolygonAltitude}
          onClick={handleClick}
          onHover={handleHover}
          onGlobeReady={() => setGlobeReady(true)}
        />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
      <ElectricityPriceComponent hoveredCountry={hoveredCountry} />
    </>
  );
};


export default GlobeViz;
