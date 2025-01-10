"use client";

import React, { useState, useEffect, useRef } from "react";
import EarthNightUrl from "../../public/earth-night-light.jpg";
import NightSkyUrl from "../../public/night-sky-light.png";
import dynamic from "next/dynamic";
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });
import {
  getGeoJsonData,
  COUNTRY_COORDINATES,
} from "@/utilities/CountryConfig/Link";
import useSWR from "swr";

// Distinctive colors for each country based on their flags (kept for reference)
// const COUNTRY_COLORS: { [key: string]: string } = {
//   au: '#00008B', // Dark blue from Australian flag
//   br: '#009c3b', // Green from Brazilian flag
//   co: '#FCD116', // Yellow from Colombian flag
//   de: '#DD0000', // Red from German flag
//   in: '#FF9933', // Orange from Indian flag
//   it: '#009246', // Green from Italian flag
//   mx: '#006847', // Green from Mexican flag
//   ng: '#008751', // Green from Nigerian flag
//   us: '#3C3B6E', // Blue from US flag
//   za: '#007749', // Green from South African flag
// };

// Project color palette implementation for countries
const COUNTRY_COLORS: { [key: string]: string } = {
  au: '#E41E3C', // Primary red
  br: '#7C9885', // Secondary green
  co: '#D7E5BE', // Tertiary light green
  de: '#CDDBB5', // Tertiary muted green
  in: '#E3E6DA', // Tertiary light gray-green
  it: '#F5F5DC', // Tertiary beige
  mx: '#E6E6E6', // Neutral light gray
  ng: '#F2F5F3', // Neutral off-white
  us: '#1C1C2C', // Neutral dark
  za: '#7C9885'  // Secondary green (repeated as we need 10 colors)
};

// Country names in English
const COUNTRY_NAMES: { [key: string]: string } = {
  au: 'Australia',
  br: 'Brazil',
  co: 'Colombia',
  de: 'Germany',
  in: 'India',
  it: 'Italy',
  mx: 'Mexico',
  ng: 'Nigeria',
  us: 'United States',
  za: 'South Africa'
};

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
  const globeRef = useRef<any>();

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

  const getPolygonColor = (d: any) => {
    const countryCode = d.id?.split('_')[0]?.toLowerCase();
    return COUNTRY_COLORS[countryCode] || '#cccccc';
  };

  const getPolygonSideColor = (d: any) => {
    const countryCode = d.id?.split('_')[0]?.toLowerCase();
    const baseColor = COUNTRY_COLORS[countryCode] || '#cccccc';
    // Convert hex color to rgba with 30% opacity
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  };

  return (
    <Globe
      ref={globeRef}
      width={dimensions.width}
      height={dimensions.height}
      globeImageUrl={EarthNightUrl.src}
      backgroundImageUrl={NightSkyUrl.src}
      polygonsData={data?.features || []}
      polygonCapColor={getPolygonColor}
      polygonSideColor={getPolygonSideColor}
      polygonStrokeColor={getPolygonColor}
      polygonAltitude={0.02}
      polygonsTransitionDuration={300}
      polygonLabel={(d: any) => {
        const countryCode = d.id?.split('_')[0]?.toLowerCase();
        const countryName = COUNTRY_NAMES[countryCode];
        return `
          <div style="background: white; padding: 5px; border-radius: 5px;">
            <div>${countryName || 'Unknown Country'}</div>
          </div>
        `;
      }}
    />
  );
};

export default Page;
