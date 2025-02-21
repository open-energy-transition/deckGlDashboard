"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl, { CircleLayer } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { useCountry } from '@/components/country-context';
import { COUNTRY_COORDINATES, COUNTRY_VIEW_CONFIG, getGeoJsonData, COUNTRY_S_NOM_RANGES, COUNTRY_BUS_RANGES } from '@/utilities/CountryConfig/Link';
import MySideDrawer from './popups/SideDrawer';
import { getMapboxRadiusExpression } from '../../app/utilities/capacityRanges';

// Constants for layer IDs
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
  FLY_TO: 800,
  TRANSITION: 200
};

const MapboxNetwork = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const eventListenersRef = useRef<{ [key: string]: any }>({});
  const { theme } = useTheme();
  const { selectedCountry } = useCountry();
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

  // Set initial mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    setMapStyle(theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11');
  }, [theme]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !isMounted || !mapStyle || !selectedCountry) {
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
      maxZoom: 20
    });

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

    const loadHandler = () => {
      setMapLoaded(true);
    };

    const zoomHandler = () => {
      setZoomLevel(map.getZoom());
    };

    map.on('load', loadHandler);
    map.on('zoom', zoomHandler);
    
    eventListenersRef.current = {
      load: loadHandler,
      zoom: zoomHandler
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
    };
  }, [mapStyle, isMounted, selectedCountry]);

  const removeEventListeners = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(eventListenersRef.current).forEach(([event, listener]) => {
      map.off(event, listener);
    });
    eventListenersRef.current = {};
  }, []);

  const updateMapData = useCallback(async (map: mapboxgl.Map) => {
    if (!map.loaded() || !map.isStyleLoaded()) {
      return;
    }

    try {
      const geoData = getGeoJsonData(selectedCountry);
      console.log('GeoData buses:', geoData.buses);
      
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
      
      map.addSource('country-data', {
        type: 'geojson',
        data: geoData.countryView
      });

      map.addSource('lines-data', {
        type: 'geojson',
        data: geoData.lines
      });

      // Log the buses data before adding it as a source
      const response = await fetch(geoData.buses);
      const busesData = await response.json();
      
      // Detailed logging of the first few features
      console.log('Sample bus features with total_capacity:', 
        busesData.features.slice(0, 5).map((f: { properties: { Bus: string; total_capacity: string } }) => ({
          bus: f.properties.Bus,
          total_capacity: f.properties.total_capacity,
          parsed_capacity: parseFloat(f.properties.total_capacity)
        }))
      );

      // Calculate capacity statistics for dynamic scaling
      const capacities = busesData.features
        .map((f: { properties: { Bus: string; total_capacity: string } }) => {
          const cap = parseFloat(f.properties.total_capacity);
          if (cap > 0) {
            console.log(`Bus ${f.properties.Bus}: ${cap} MW`);
          }
          return cap;
        })
        .filter((c: number) => c !== null && c !== undefined && !isNaN(c) && c > 0);

      // Log capacity distribution
      const capacityRanges = {
        '0': capacities.filter((c: number) => c === 0).length,
        '0-1000': capacities.filter((c: number) => c > 0 && c <= 1000).length,
        '1000-5000': capacities.filter((c: number) => c > 1000 && c <= 5000).length,
        '5000-10000': capacities.filter((c: number) => c > 5000 && c <= 10000).length,
        '10000-50000': capacities.filter((c: number) => c > 10000 && c <= 50000).length,
        '>50000': capacities.filter((c: number) => c > 50000).length
      };
      
      console.log('Capacity distribution:', capacityRanges);

      const maxCapacity = Math.max(...capacities);
      const minCapacity = Math.min(...capacities);
      
      console.log('Capacity range:', {
        min: minCapacity,
        max: maxCapacity,
        total_buses: busesData.features.length,
        buses_with_capacity: capacities.length
      });

      map.addSource('buses-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: busesData.features
        }
      });

      // Store capacity stats for use in the layer configuration
      const capacityStats = {
        min: minCapacity,
        max: maxCapacity,
        quartiles: [maxCapacity * 0.25, maxCapacity * 0.5, maxCapacity * 0.75]
      };
      console.log('Capacity statistics:', capacityStats);

      map.addLayer({
        id: LAYER_IDS.COUNTRY,
        type: 'fill',
        source: 'country-data',
        paint: {
          'fill-color': '#d7e5be',
          'fill-opacity': 0.4
        }
      });

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

      // Log the layer configuration before adding it
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
      console.log('Bus layer config:', busLayerConfig);

      map.addLayer(busLayerConfig);

      // Verify the layer was added successfully
      console.log('Is bus layer added?', map.getLayer(LAYER_IDS.BUSES) !== undefined);
      
      // Log a sample feature to check properties
      const features = map.querySourceFeatures('buses-data');
      console.log('Sample bus features:', features.slice(0, 2));

      const mousemoveHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const busId = feature.properties?.Bus;
          
          if (busId && busId !== selectedBus) {
            map.getCanvas().style.cursor = 'pointer';
            
            if (hoveredBus) {
              map.setFeatureState(
                { source: 'buses-data', id: busId },
                { hover: false }
              );
            }
            
            map.setFeatureState(
              { source: 'buses-data', id: busId },
              { hover: true }
            );
            
            setHoveredBus(busId);
          }
        } else {
          map.getCanvas().style.cursor = '';
          if (hoveredBus) {
            map.setFeatureState(
              { source: 'buses-data', id: hoveredBus },
              { hover: false }
            );
            setHoveredBus(null);
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
      console.error('Error updating map data:', error);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !isMounted) {
      return;
    }

    const styleLoadHandler = () => {
      updateMapData(map);
    };

    if (map.isStyleLoaded()) {
      styleLoadHandler();
    } else {
      map.once('style.load', styleLoadHandler);
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [selectedCountry, mapLoaded, isMounted, updateMapData]);

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