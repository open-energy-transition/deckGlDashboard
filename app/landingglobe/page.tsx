"use client";

import React, { useState, useEffect, useRef, forwardRef, use } from "react";
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

const Page = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { selectedCountry, setSelectedCountry } = useCountry();

  const globeRef = useRef<any>();

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      console.log("globeref", data);
    }
  }, [selectedCountry]);

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
    <>
      <GlobeNav />
      <RightDrawer />
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        showAtmosphere={true}
        globeImageUrl={
          theme === "dark"
            ? "//unpkg.com/three-globe/example/img/earth-dark.jpg"
            : EarthLightUrl.src
        }
        backgroundImageUrl={
          theme === "dark"
            ? "//unpkg.com/three-globe/example/img/night-sky.png"
            : LightSkyUrl.src
        }
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        polygonsData={data?.features || []}
        polygonCapColor={getPolygonColor}
        polygonSideColor={getPolygonSideColor}
        polygonStrokeColor={getPolygonColor}
        polygonAltitude={(d: any) => {
          const countryCode = d.id
            ?.split("_")[0]
            ?.substring(0, 2)
            .toLowerCase();
          if (selectedCountry === countryCode.toUpperCase()) {
            return 0.1;
          }

          return 0.01;
        }}
        polygonsTransitionDuration={300}
        polygonLabel={(d: any) => {
          const countryCode = d.id?.split("_")[0]?.toLowerCase();
          const countryName =
            COUNTRY_NAMES[
              countryCode.toUpperCase() as keyof typeof COUNTRY_NAMES
            ];
            return `
            <div style="background: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)">
            <div style="color: black">${countryName || "Unknown Country"}</div>
            </div>
          `;
        }}
        onPolygonClick={(d: any) => {
          const countryCode = d.id
            ?.split("_")[0]
            ?.substring(0, 2)
            .toLowerCase();
          console.log("polygon clicked", countryCode.toUpperCase());
          setSelectedCountry(countryCode.toUpperCase());
        }}
      />
    </>
  );
};

export default Page;
