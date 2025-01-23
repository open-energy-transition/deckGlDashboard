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
import { LucideArrowRightSquare } from "lucide-react";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Color } from "three";
const GlobeViz = dynamic(() => import("./Globe"), { ssr: false });

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

const Page = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const [drawerOpen, setdrawerOpen] = useState(false);

  useEffect(() => {
    // setdrawerOpen(true);
    console.log("drawerOpen", drawerOpen);
  }, [drawerOpen]);

  return (
    <>
      <div
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 h-20 w-20 cursor-pointer"
        onClick={() => {
          setdrawerOpen(true);
        }}
      >
        <LucideArrowRightSquare className="h-full w-full" />
      </div>
      <GlobeNav open={drawerOpen} setIsOpen={setdrawerOpen} />
      <RightDrawer isOpen={drawerOpen} setIsOpen={setdrawerOpen} />
      <div style={{ height: height || "100vh" }}>
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
        </Canvas>
      </div>
    </>
  );
};

export default Page;
