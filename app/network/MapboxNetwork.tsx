"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl, { CircleLayer } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { useCountry } from '@/components/country-context';
import { COUNTRY_COORDINATES, COUNTRY_VIEW_CONFIG, getGeoJsonData, COUNTRY_S_NOM_RANGES, COUNTRY_BUS_RANGES } from '@/utilities/CountryConfig/Link';
import MySideDrawer from './popups/SideDrawer';
import { getMapboxRadiusExpression } from '../../app/utilities/capacityRanges';

const LAYER_IDS = {
  COUNTRY: 'country-layer',
  LINES: 'transmission-lines',
  BUSES: 'bus-stations',
  LABELS: 'country-labels'
};

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

    
const BUS_SIZE_RANGES = {
  VERY_SMALL: { max: 1, radius: 4 },      // 0-1 GVA
  SMALL: { max: 5, radius: 6 },           // 1-5 GVA
  MEDIUM: { max: 20, radius: 8 },         // 5-20 GVA
  LARGE: { max: 50, radius: 12 },         // 20-50 GVA
  VERY_LARGE: { radius: 16 }              // >50 GVA
};

const STATE_MULTIPLIERS = {
  BASE: 1,
  HOVER: 1.3,
  SELECTED: 1.5
};

const ANIMATION_DURATION = {
  FLY_TO: 1500,
  TRANSITION: 200
};

const MapboxNetwork = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const eventListenersRef = useRef<{ [key: string]: any }>({});
  const { theme } = useTheme();
  const { selectedCountry } = useCountry();
  const prevCountryRef = useRef<string>(selectedCountry);
  const [mapStyle, setMapStyle] = useState<string>(
    theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11'
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(4);
  const initializeStartedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const isTransitioningRef = useRef(false);
  const initialLoadCompletedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  const dataLoadingRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 10;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const removeEventListeners = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(eventListenersRef.current).forEach(([event, listener]) => {
      map.off(event, listener);
    });
    eventListenersRef.current = {};
  }, []);

  const setupBusLayerEvents = useCallback((map: mapboxgl.Map) => {
    if (!map.getLayer(LAYER_IDS.BUSES)) {
      console.error(`Cannot configure events: layer ${LAYER_IDS.BUSES} does not exist`);
      return;
    }

 
    if (eventListenersRef.current[`mousemove.${LAYER_IDS.BUSES}`]) {
      map.off('mousemove', LAYER_IDS.BUSES, eventListenersRef.current[`mousemove.${LAYER_IDS.BUSES}`]);
    }
    if (eventListenersRef.current[`mouseleave.${LAYER_IDS.BUSES}`]) {
      map.off('mouseleave', LAYER_IDS.BUSES, eventListenersRef.current[`mouseleave.${LAYER_IDS.BUSES}`]);
    }
    if (eventListenersRef.current[`click.${LAYER_IDS.BUSES}`]) {
      map.off('click', LAYER_IDS.BUSES, eventListenersRef.current[`click.${LAYER_IDS.BUSES}`]);
    }

    const mousemoveHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        
          const feature = e.features[0];
          const busId = feature.properties?.Bus;
          
        if (busId && busId !== hoveredBus && busId !== selectedBus) {
            if (hoveredBus) {
              map.setFeatureState(
              { source: 'buses-data', id: hoveredBus },
                { hover: false }
              );
            }
            
            map.setFeatureState(
              { source: 'buses-data', id: busId },
              { hover: true }
            );
            
            setHoveredBus(busId);
          }
        }
      };

      const mouseleaveHandler = () => {
        map.getCanvas().style.cursor = '';
      
        if (hoveredBus) {
          map.setFeatureState(
            { source: 'buses-data', id: hoveredBus },
            { hover: false }
          );
        
          setHoveredBus(null);
        }
      };

      const clickHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const busId = feature.properties?.Bus;
          
          if (busId) {
            if (selectedBus === busId) {
              map.setFeatureState(
                { source: 'buses-data', id: busId },
                { selected: false }
              );
              setSelectedBus(null);
              setDrawerOpen(false);
            } else {
              if (selectedBus) {
                map.setFeatureState(
                  { source: 'buses-data', id: selectedBus },
                  { selected: false }
                );
              }
              
              map.setFeatureState(
                { source: 'buses-data', id: busId },
                { selected: true }
              );
              
              setSelectedBus(busId);
              setHoveredBus(null);
              setDrawerOpen(true);
              
              if (e.lngLat) {
                map.flyTo({
                  center: [e.lngLat.lng - 0.1, e.lngLat.lat],
                  zoom: Math.max(map.getZoom(), 6),
                  duration: ANIMATION_DURATION.FLY_TO
                });
              }
            }
          }
        }
      };

    map.on('mousemove', LAYER_IDS.BUSES, mousemoveHandler);
    map.on('mouseleave', LAYER_IDS.BUSES, mouseleaveHandler);
    map.on('click', LAYER_IDS.BUSES, clickHandler);

    eventListenersRef.current = {
      ...eventListenersRef.current,
      [`mousemove.${LAYER_IDS.BUSES}`]: mousemoveHandler,
      [`mouseleave.${LAYER_IDS.BUSES}`]: mouseleaveHandler,
      [`click.${LAYER_IDS.BUSES}`]: clickHandler
    };
  }, [hoveredBus, selectedBus, setHoveredBus, setSelectedBus, setDrawerOpen]);

  const updateMapData = useCallback(async (map: mapboxgl.Map) => {
    if (dataLoadingRef.current) {
      return;
    }

    if (!map.loaded() || !map.isStyleLoaded()) {
      retryCountRef.current++;
      
      if (retryCountRef.current > MAX_RETRIES) {
        console.error(`Too many failed attempts to load data for ${selectedCountry}, aborting`);
        retryCountRef.current = 0;
        return;
      }
      
      updateTimeoutRef.current = setTimeout(() => updateMapData(map), 500);
      return;
    }

    retryCountRef.current = 0;
    dataLoadingRef.current = true;

    try {
      const geoData = getGeoJsonData(selectedCountry);

      [LAYER_IDS.BUSES, LAYER_IDS.LINES, LAYER_IDS.COUNTRY].forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      ['country-data', 'lines-data', 'buses-data'].forEach(sourceId => {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
      
      if (!geoData.countryView || !geoData.lines || !geoData.buses) {
        console.error(`Incomplete geographic data for ${selectedCountry}`);
        dataLoadingRef.current = false;
        return;
      }

      try {
        map.addSource('country-data', {
          type: 'geojson',
          data: geoData.countryView
        });
      } catch (error) {
        console.error(`Error adding country-data source:`, error);
      }

      try {
        map.addSource('lines-data', {
          type: 'geojson',
          data: geoData.lines
        });
      } catch (error) {
        console.error(`Error adding lines-data source:`, error);
      }

      let busesData;
      try {
        const response = await fetch(geoData.buses);
        
        if (!response.ok) {
          throw new Error(`Error fetching bus data: ${response.status} ${response.statusText}`);
        }
        
        busesData = await response.json();
      } catch (error) {
        console.error(`Error fetching bus data:`, error);
        busesData = { type: 'FeatureCollection', features: [] };
      }
      
      const capacities = busesData.features
        .map((f: { properties: { Bus: string; total_capacity: string } }) => {
          const cap = parseFloat(f.properties.total_capacity);
          return cap;
        })
        .filter((c: number) => c !== null && c !== undefined && !isNaN(c) && c > 0);

      const maxCapacity = capacities.length > 0 ? Math.max(...capacities) : 1000;
      const minCapacity = capacities.length > 0 ? Math.min(...capacities) : 0;

      try {
        map.addSource('buses-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: busesData.features
          }
        });
      } catch (error) {
        console.error(`Error adding buses-data source:`, error);
      }

      const capacityStats = {
        min: minCapacity,
        max: maxCapacity,
        quartiles: [maxCapacity * 0.25, maxCapacity * 0.5, maxCapacity * 0.75]
      };

      if (map.getSource('country-data')) {
        try {
          map.addLayer({
            id: LAYER_IDS.COUNTRY,
            type: 'fill',
            source: 'country-data',
            paint: {
              'fill-color': '#d7e5be',
              'fill-opacity': 0.4
            }
          });
        } catch (error) {
          console.error(`Error adding layer ${LAYER_IDS.COUNTRY}:`, error);
        }
      } else {
        console.error(`Could not add layer ${LAYER_IDS.COUNTRY}: source not found`);
      }

      if (map.getSource('lines-data')) {
        try {
          map.addLayer({
            id: LAYER_IDS.LINES,
            type: 'line',
            source: 'lines-data',
            paint: {
              'line-color': 'rgba(228, 30, 60, 0.6)',
              'line-width': [
                'interpolate',
                ['linear'],
                ['get', 's_nom'],
                500, 1.5,
                5000, 3,
                15000, 4.5,
                30000, 6
              ]
            }
          });
        } catch (error) {
          console.error(`Error adding layer ${LAYER_IDS.LINES}:`, error);
        }
      } else {
        console.error(`Could not add layer ${LAYER_IDS.LINES}: source not found`);
      }

      const busLayerConfig: CircleLayer = {
        id: LAYER_IDS.BUSES,
        type: 'circle',
        source: 'buses-data',
        paint: {
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#ff9e3d',
            ['boolean', ['feature-state', 'hover'], false], '#8fb3a3',
            '#7c9885'
          ],
          'circle-radius': getMapboxRadiusExpression(capacities),
          'circle-opacity': 0.8,
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 2,
            ['boolean', ['feature-state', 'hover'], false], 1,
            0
          ],
          'circle-stroke-color': '#ffffff'
        }
      };

      if (map.getSource('buses-data')) {
        try {
          map.addLayer(busLayerConfig);
          
          if (!map.getLayer(LAYER_IDS.BUSES)) {
            console.error(`Layer ${LAYER_IDS.BUSES} was not added correctly`);
          }
        } catch (error) {
          console.error(`Error adding layer ${LAYER_IDS.BUSES}:`, error);
        }
      } else {
        console.error(`Could not add layer ${LAYER_IDS.BUSES}: source not found`);
      }

      if (map.getLayer(LAYER_IDS.BUSES)) {
        setupBusLayerEvents(map);
      } else {
        console.error(`Could not configure events: layer ${LAYER_IDS.BUSES} does not exist`);
      }

      try {
      const labelLayers = map.getStyle().layers.filter(layer => 
        layer.type === 'symbol' && 
        (layer.layout?.['text-field'] || layer.id.includes('label'))
      );

      labelLayers.forEach(layer => {
        if (map.getLayer(layer.id)) {
          map.moveLayer(layer.id);
        }
      });
      } catch (error) {
        console.error(`Error moving label layers:`, error);
      }

    } catch (error) {
      console.error(`Error updating data for ${selectedCountry}:`, error);
    } finally {
      dataLoadingRef.current = false;
      isTransitioningRef.current = false;
    }
  }, [selectedCountry, setupBusLayerEvents]);

  useEffect(() => {
    const newMapStyle = theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11';
    
    if (mapStyle === newMapStyle) {
      return;
    }
    
    setMapStyle(newMapStyle);
    
    const map = mapRef.current;
    if (map && mapLoaded && isMounted && !isTransitioningRef.current) {
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    
      const hasCountryLayer = map.getLayer(LAYER_IDS.COUNTRY) !== undefined;
      const hasLinesLayer = map.getLayer(LAYER_IDS.LINES) !== undefined;
      const hasBusesLayer = map.getLayer(LAYER_IDS.BUSES) !== undefined;
      
      isTransitioningRef.current = true;
      
      map.setStyle(newMapStyle);
      
      map.once('style.load', () => {
        if (hasCountryLayer || hasLinesLayer || hasBusesLayer) {
          setTimeout(() => {
            updateMapData(map);
          }, 100);
        } else {
          isTransitioningRef.current = false;
        }
      });
    }
  }, [theme, mapLoaded, isMounted, updateMapData, mapStyle]);

  const verifyMapState = useCallback((map: mapboxgl.Map, country: string) => {
    if (!map) {
      console.error('Cannot verify state: map not initialized');
      return false;
    }

    const hasCountryLayer = map.getLayer(LAYER_IDS.COUNTRY) !== undefined;
    const hasLinesLayer = map.getLayer(LAYER_IDS.LINES) !== undefined;
    const hasBusesLayer = map.getLayer(LAYER_IDS.BUSES) !== undefined;
    
    const hasCountrySource = map.getSource('country-data') !== undefined;
    const hasLinesSource = map.getSource('lines-data') !== undefined;
    const hasBusesSource = map.getSource('buses-data') !== undefined;
    
    return (hasCountryLayer && hasLinesLayer && hasBusesLayer) && 
           (hasCountrySource && hasLinesSource && hasBusesSource);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !isMounted || !mapStyle) {
      return;
    }
    
    if (mapRef.current) {
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [COUNTRY_COORDINATES[selectedCountry][1], COUNTRY_COORDINATES[selectedCountry][0]],
      zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
      minZoom: 3,
      maxZoom: 20,
      attributionControl: false,
      preserveDrawingBuffer: true
    });

    // Add controls
    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }),
      'bottom-right'
    );

    map.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'metric' }),
      'bottom-left'
    );

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true
      })
    );

    const loadHandler = () => {
      setMapLoaded(true);
      mapInitializedRef.current = true;
    };

    const zoomHandler = () => {
      setZoomLevel(map.getZoom());
    };

    const errorHandler = (e: ErrorEvent) => {
      console.error('Map error:', e);
    };

    map.on('load', loadHandler);
    map.on('zoom', zoomHandler);
    map.on('error', errorHandler);
    
    eventListenersRef.current = {
      load: loadHandler,
      zoom: zoomHandler,
      error: errorHandler
    };

    mapRef.current = map;

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      removeEventListeners();
      if (map) {
        map.remove();
      }
      mapRef.current = null;
      setMapLoaded(false);
      mapInitializedRef.current = false;
    };
  }, [mapStyle, isMounted, removeEventListeners]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !isMounted) {
      return;
    }

    if (prevCountryRef.current !== selectedCountry) {
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      isTransitioningRef.current = true;
      dataLoadingRef.current = false;
      
      if (selectedBus) {
        try {
          map.setFeatureState(
            { source: 'buses-data', id: selectedBus },
            { selected: false }
          );
          setSelectedBus(null);
          setDrawerOpen(false);
        } catch (error) {
        }
      }
      
      prevCountryRef.current = selectedCountry;
      
      [LAYER_IDS.BUSES, LAYER_IDS.LINES, LAYER_IDS.COUNTRY].forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      ['country-data', 'lines-data', 'buses-data'].forEach(sourceId => {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
      
      map.flyTo({
        center: [COUNTRY_COORDINATES[selectedCountry][1], COUNTRY_COORDINATES[selectedCountry][0]],
        zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
        duration: ANIMATION_DURATION.FLY_TO,
        essential: true 
      });

      map.once('moveend', () => {
        
        if (!map.isStyleLoaded()) {
          
          let retryCount = 0;
          const MAX_STYLE_RETRIES = 20;
          
          const checkStyleAndUpdate = () => {
            retryCount++;
            
            if (retryCount > MAX_STYLE_RETRIES) {
              console.error(`Could not load style after ${MAX_STYLE_RETRIES} attempts, forcing update`);
              updateMapData(map);
              return;
            }
            
            if (map.isStyleLoaded()) {
              updateMapData(map);
            } else {
              setTimeout(checkStyleAndUpdate, 100);
            }
          };
          
          checkStyleAndUpdate();
        } else {
          updateMapData(map);
        }
      });
    }
  }, [selectedCountry, mapLoaded, isMounted, updateMapData, selectedBus, setSelectedBus, setDrawerOpen]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !isMounted || initialLoadCompletedRef.current || isTransitioningRef.current) {
      return;
    }
    
    if (!map.isStyleLoaded()) {
      
      let retryCount = 0;
      const MAX_STYLE_RETRIES = 20;
      
      const checkStyleAndUpdate = () => {
        retryCount++;
        
        if (retryCount > MAX_STYLE_RETRIES) {
          console.error(`Could not load style after ${MAX_STYLE_RETRIES} attempts, forcing update`);
          updateMapData(map);
          initialLoadCompletedRef.current = true;
          return;
        }
        
        if (map.isStyleLoaded()) {
          updateMapData(map);
          initialLoadCompletedRef.current = true;
        } else {
          setTimeout(checkStyleAndUpdate, 100);
        }
      };
      
      checkStyleAndUpdate();
    } else {
      updateMapData(map);
      initialLoadCompletedRef.current = true;
    }
  }, [mapLoaded, isMounted, updateMapData, selectedCountry]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !isMounted || !initialLoadCompletedRef.current || isTransitioningRef.current) {
      return;
    }

    const checkMapState = () => {
      const isMapComplete = verifyMapState(map, selectedCountry);
      
      if (!isMapComplete && !isTransitioningRef.current && !dataLoadingRef.current) {
        updateMapData(map);
      }
    };

    const stateCheckTimeout = setTimeout(checkMapState, 10000);

    return () => {
      clearTimeout(stateCheckTimeout);
    };
  }, [mapLoaded, isMounted, selectedCountry, verifyMapState, updateMapData]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }} 
        className="absolute inset-0"
      />
      <MySideDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        side="right"
        data={selectedBus ? {
          busId: selectedBus,
          countryCode: selectedCountry
        } : null}
      />
    </>
  );
};

export default MapboxNetwork; 