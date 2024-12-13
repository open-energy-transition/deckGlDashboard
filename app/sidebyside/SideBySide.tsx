"use client";
import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import Map, {
  useControl,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  ViewStateChangeEvent,
} from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import ModePannel from "./Mode";
import { Mode } from "./Mode";
import { useCountry } from "@/components/country-context";
import { getGeoJsonData, COUNTRY_COORDINATES, COUNTRY_VIEW_CONFIG } from "./components/Links";
import { useVisualization } from "@/components/visualization-context";

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

const TOKEN = "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw";

const LeftMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
  left: 0
};

const RightMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
  left: "50%"
};

export default function SideBySide() {
  const { selectedCountry } = useCountry();
  const [mode, setMode] = useState<Mode>("split-screen");
  const [activeMap, setActiveMap] = useState<"left" | "right">("left");
  const { selectedRenewableType, selectedParameter } = useVisualization();

  const [viewState, setViewState] = useState({
    latitude: COUNTRY_COORDINATES[selectedCountry][0],
    longitude: COUNTRY_COORDINATES[selectedCountry][1],
    zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
    minZoom: 2,
    maxZoom: 20,
    pitch: 0,
    bearing: 0
  });

  const width = typeof window === "undefined" ? 100 : window.innerWidth;
  const leftMapPadding = useMemo(() => {
    return {
      left: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }, [width, mode]);

  const rightMapPadding = useMemo(() => {
    return {
      right: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0,
    };
  }, [width, mode]);

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt: ViewStateChangeEvent) => setViewState({
    ...evt.viewState,
    minZoom: 2,
    maxZoom: 20
  }), []);

  const [layer2021, setLayer2021] = useState<GeoJsonLayer[]>([]);
  const [layer2050, setLayer2050] = useState<GeoJsonLayer[]>([]);

  const getColorForParameter = (value: number, parameter: string) => {
    type ColorScale = Array<[number, [number, number, number, number]]>;
    
    const scales: Record<string, ColorScale> = {
      cf: [
        [0, [65, 182, 196, 180]],    // 0-10%
        [10, [160, 170, 120, 180]],  // 10-25%
        [25, [254, 153, 41, 180]],   // 25-40%
        [40, [245, 110, 40, 180]],   // 40-60%
        [60, [239, 59, 44, 180]]     // >60%
      ],
      crt: [
        [0, [65, 171, 93, 180]],     // 0-5%
        [5, [160, 170, 90, 180]],    // 5-15%
        [15, [254, 153, 41, 180]],   // 15-30%
        [30, [245, 110, 40, 180]],   // 30-50%
        [50, [239, 59, 44, 180]]     // >50%
      ],
      usdpt: [
        [0, [239, 59, 44, 180]],     // 0-20%
        [20, [254, 153, 41, 180]],   // 20-40%
        [40, [160, 170, 90, 180]],   // 40-60%
        [60, [65, 171, 93, 180]],    // 60-80%
        [80, [65, 182, 196, 180]]    // >80%
      ]
    };

    const scale = scales[parameter as keyof typeof scales] || scales.cf;
    
    // Linear interpolation between colors
    for (let i = 1; i < scale.length; i++) {
      if (value <= scale[i][0]) {
        const t = (value - scale[i-1][0]) / (scale[i][0] - scale[i-1][0]);
        const startColor = scale[i-1][1] as [number, number, number, number];
        const endColor = scale[i][1] as [number, number, number, number];
        return startColor.map((start, j) => 
          Math.round(start + t * (endColor[j] - start))
        ) as [number, number, number, number];
      }
    }
    return scale[scale.length - 1][1];
  };

  const filterAndColorFeatures = (feature: any): [number, number, number, number] => {
    const generator = feature.properties.Generator?.toLowerCase() || '';
    const type = generator.split(' ').slice(-1)[0];
    
    if (type !== selectedRenewableType) {
      return [0, 0, 0, 0]; // Transparent if not selected type
    }

    const paramValue = feature.properties[selectedParameter];
    return getColorForParameter(paramValue || 0, selectedParameter);
  };

  useEffect(() => {
    const commonProps = {
      stroked: true,
      filled: true,
      getFillColor: filterAndColorFeatures as any,
      getLineColor: [255, 255, 255] as [number, number, number],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      pickable: true,
      parameters: {
        depthTest: false,
        blend: true,
        blendFunc: [770, 771]
      },
      updateTriggers: {
        getFillColor: [selectedRenewableType, selectedParameter]
      },
      onHover: (info: any) => {
        if (info.object) {
          console.log('Region:', info.object.properties.name);
          console.log('Value:', info.object.properties[selectedParameter]);
        }
      }
    };

    const urls = getGeoJsonData(selectedCountry);
    
    // Fetch 2021 data
    fetch(urls.regions_2021)
      .then(response => response.json())
      .then(data => {
        setLayer2021([
          new GeoJsonLayer({
            id: 'regions-2021',
            data,
            ...commonProps
          })
        ]);
      });

    // Fetch 2050 data
    fetch(urls.regions_2050)
      .then(response => response.json())
      .then(data => {
        setLayer2050([
          new GeoJsonLayer({
            id: 'regions-2050',
            data,
            ...commonProps
          })
        ]);
      });
  }, [selectedCountry, selectedRenewableType, selectedParameter]);

  useEffect(() => {
    // Update viewState when country changes
    setViewState({
      ...viewState,
      latitude: COUNTRY_COORDINATES[selectedCountry][0],
      longitude: COUNTRY_COORDINATES[selectedCountry][1],
      zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
      bearing: 0,
      pitch: 0
    });
  }, [selectedCountry]);

  return (
    <div className="relative w-full h-full">
      <Map
        id="left-map"
        {...viewState}
        padding={leftMapPadding}
        onMoveStart={onLeftMoveStart}
        onMove={activeMap === "left" ? onMove : undefined}
        style={LeftMapStyle}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={TOKEN}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-right" />
        <DeckGLOverlay layers={layer2021} />
      </Map>

      <Map
        id="right-map"
        {...viewState}
        padding={rightMapPadding}
        onMoveStart={onRightMoveStart}
        onMove={activeMap === "right" ? onMove : undefined}
        style={RightMapStyle}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={TOKEN}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-right" />
        <DeckGLOverlay layers={layer2050} />
      </Map>

      <ModePannel mode={mode} onModeChange={setMode} />
    </div>
  );
}
