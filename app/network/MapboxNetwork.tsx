"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { useCountry } from '@/components/country-context';
import { COUNTRY_COORDINATES, COUNTRY_VIEW_CONFIG, getGeoJsonData, COUNTRY_S_NOM_RANGES, COUNTRY_BUS_RANGES } from '@/utilities/CountryConfig/Link';
import MySideDrawer from './popups/SideDrawer';

// Constants for layer IDs
const LAYER_IDS = {
  COUNTRY: 'country-layer',
  LINES: 'transmission-lines',
  BUSES: 'bus-stations',
  LABELS: 'country-labels'
};

const COUNTRY_BUS_CONFIGS = {
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
  const [mapStyle, setMapStyle] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busCapacities, setBusCapacities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(4);
  const initializeStartedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsMounted(true);
    setMapStyle(theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11');
  }, [theme]);

  const loadBusCapacities = useCallback(async (country: string) => {
    if (!country) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bustotal/${country}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid API response format");
      }

      const capacities = data.data.reduce(
        (acc: Record<string, number>, item: any) => {
          if (item.bus && typeof item.total_capacity === "number") {
            const gva = item.total_capacity / 1000;
            acc[item.bus] = gva;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(capacities).length === 0) {
        throw new Error("No valid bus capacities found in response");
      }

      setBusCapacities(capacities);
    } catch (error) {
      setBusCapacities({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateBusRadius = useCallback((busId: string, capacity: number) => {
    if (!capacity) return COUNTRY_BUS_CONFIGS[selectedCountry].minRadius / 100;

    const config = COUNTRY_BUS_CONFIGS[selectedCountry];
    const { minRadius, maxRadius, zoomBase } = config;

    const capacityValues = Object.values(busCapacities);
    const minCapacity = Math.min(...capacityValues);
    const maxCapacity = Math.max(...capacityValues);

    const logBase = 2;
    const logMin = Math.log(minCapacity + 1) / Math.log(logBase);
    const logMax = Math.log(maxCapacity + 1) / Math.log(logBase);
    const logCurrent = Math.log(capacity + 1) / Math.log(logBase);

    const normalizedSize = (logCurrent - logMin) / (logMax - logMin);
    const dispersedSize = Math.pow(normalizedSize, 0.4);

    const baseRadius = minRadius + (maxRadius - minRadius) * dispersedSize;

    const zoomFactor = Math.pow(zoomBase, zoomLevel - 5);

    const numBuses = capacityValues.length;
    const densityFactor = Math.max(0.6, 1 - numBuses / 200);

    return (baseRadius * zoomFactor * densityFactor) / 100;
  }, [selectedCountry, busCapacities, zoomLevel]);

  const removeEventListeners = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(eventListenersRef.current).forEach(([event, listener]) => {
      map.off(event, listener);
    });
    eventListenersRef.current = {};
  }, []);

  const updateMapData = useCallback(async (map: mapboxgl.Map) => {
    if (!map.loaded()) return;
    if (!map.isStyleLoaded()) return;

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

      map.addSource('country-data', {
        type: 'geojson',
        data: geoData.countryView
      });

      map.addSource('lines-data', {
        type: 'geojson',
        data: geoData.lines
      });

      map.addSource('buses-data', {
        type: 'geojson',
        data: geoData.buses
      });

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

      map.addLayer({
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
          'circle-radius': [
            'let',
            'busId',
            ['get', 'Bus'],
            [
              'let',
              'capacity',
              ['case',
                ['has', ['to-string', ['var', 'busId']], ['literal', busCapacities]],
                ['number', ['get', ['to-string', ['var', 'busId']], ['literal', busCapacities]]],
                0
              ],
              [
                'interpolate',
                ['linear'],
                ['zoom'],
                3, [
                  '*',
                  [
                    'match',
                    ['get', 'country'],
                    'US', [
                      'case',
                      ['<=', ['var', 'capacity'], 20], 4,      // 0-20 MW
                      ['<=', ['var', 'capacity'], 50], 8,      // 20-50 MW
                      ['<=', ['var', 'capacity'], 100], 12,    // 50-100 MW
                      ['<=', ['var', 'capacity'], 150], 16,    // 100-150 MW
                      20                                        // >150 MW
                    ],
                    'IN', [
                      'case',
                      ['<=', ['var', 'capacity'], 15], 4,      // 0-15 MW
                      ['<=', ['var', 'capacity'], 35], 8,      // 15-35 MW
                      ['<=', ['var', 'capacity'], 60], 12,     // 35-60 MW
                      ['<=', ['var', 'capacity'], 90], 16,     // 60-90 MW
                      20                                        // >90 MW
                    ],
                    'BR', [
                      'case',
                      ['<=', ['var', 'capacity'], 5], 4,       // 0-5 MW
                      ['<=', ['var', 'capacity'], 15], 8,      // 5-15 MW
                      ['<=', ['var', 'capacity'], 30], 12,     // 15-30 MW
                      ['<=', ['var', 'capacity'], 45], 16,     // 30-45 MW
                      20                                        // >45 MW
                    ],
                    'DE', [
                      'case',
                      ['<=', ['var', 'capacity'], 10], 4,      // 0-10 MW
                      ['<=', ['var', 'capacity'], 25], 8,      // 10-25 MW
                      ['<=', ['var', 'capacity'], 45], 12,     // 25-45 MW
                      ['<=', ['var', 'capacity'], 65], 16,     // 45-65 MW
                      20                                        // >65 MW
                    ],
                    'AU', [
                      'case',
                      ['<=', ['var', 'capacity'], 2.5], 4,     // 0-2.5 MW
                      ['<=', ['var', 'capacity'], 7.5], 8,     // 2.5-7.5 MW
                      ['<=', ['var', 'capacity'], 12.5], 12,   // 7.5-12.5 MW
                      ['<=', ['var', 'capacity'], 17.5], 16,   // 12.5-17.5 MW
                      20                                        // >17.5 MW
                    ],
                    'CO', [
                      'case',
                      ['<=', ['var', 'capacity'], 0.5], 4,     // 0-0.5 MW
                      ['<=', ['var', 'capacity'], 1.5], 8,     // 0.5-1.5 MW
                      ['<=', ['var', 'capacity'], 3], 12,      // 1.5-3 MW
                      ['<=', ['var', 'capacity'], 5], 16,      // 3-5 MW
                      20                                        // >5 MW
                    ],
                    'MX', [
                      'case',
                      ['<=', ['var', 'capacity'], 3], 4,       // 0-3 MW
                      ['<=', ['var', 'capacity'], 8], 8,       // 3-8 MW
                      ['<=', ['var', 'capacity'], 15], 12,     // 8-15 MW
                      ['<=', ['var', 'capacity'], 20], 16,     // 15-20 MW
                      20                                        // >20 MW
                    ],
                    'NG', [
                      'case',
                      ['<=', ['var', 'capacity'], 0.5], 4,     // 0-0.5 MW
                      ['<=', ['var', 'capacity'], 2], 8,       // 0.5-2 MW
                      ['<=', ['var', 'capacity'], 5], 12,      // 2-5 MW
                      ['<=', ['var', 'capacity'], 8], 16,      // 5-8 MW
                      20                                        // >8 MW
                    ],
                    'IT', [
                      'case',
                      ['<=', ['var', 'capacity'], 5], 4,       // 0-5 MW
                      ['<=', ['var', 'capacity'], 15], 8,      // 5-15 MW
                      ['<=', ['var', 'capacity'], 25], 12,     // 15-25 MW
                      ['<=', ['var', 'capacity'], 40], 16,     // 25-40 MW
                      20                                        // >40 MW
                    ],
                    'ZA', [
                      'case',
                      ['<=', ['var', 'capacity'], 2.5], 4,     // 0-2.5 MW
                      ['<=', ['var', 'capacity'], 10], 8,      // 2.5-10 MW
                      ['<=', ['var', 'capacity'], 20], 12,     // 10-20 MW
                      ['<=', ['var', 'capacity'], 35], 16,     // 20-35 MW
                      20                                        // >35 MW
                    ],
                    // Default case for any other country
                    [
                      'case',
                      ['<=', ['var', 'capacity'], 1], 4,       // 0-1 MW
                      ['<=', ['var', 'capacity'], 5], 8,       // 1-5 MW
                      ['<=', ['var', 'capacity'], 10], 12,     // 5-10 MW
                      ['<=', ['var', 'capacity'], 15], 16,     // 10-15 MW
                      20                                        // >15 MW
                    ]
                  ],
                  [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false], STATE_MULTIPLIERS.SELECTED,
                    ['boolean', ['feature-state', 'hover'], false], STATE_MULTIPLIERS.HOVER,
                    STATE_MULTIPLIERS.BASE
                  ]
                ],
                10, [
                  '*',
                  [
                    'match',
                    ['get', 'country'],
                    'US', [
                      'case',
                      ['<=', ['var', 'capacity'], 20], 8,      // 0-20 MW
                      ['<=', ['var', 'capacity'], 50], 16,     // 20-50 MW
                      ['<=', ['var', 'capacity'], 100], 24,    // 50-100 MW
                      ['<=', ['var', 'capacity'], 150], 32,    // 100-150 MW
                      40                                        // >150 MW
                    ],
                    'IN', [
                      'case',
                      ['<=', ['var', 'capacity'], 15], 8,      // 0-15 MW
                      ['<=', ['var', 'capacity'], 35], 16,     // 15-35 MW
                      ['<=', ['var', 'capacity'], 60], 24,     // 35-60 MW
                      ['<=', ['var', 'capacity'], 90], 32,     // 60-90 MW
                      40                                        // >90 MW
                    ],
                    'BR', [
                      'case',
                      ['<=', ['var', 'capacity'], 5], 8,       // 0-5 MW
                      ['<=', ['var', 'capacity'], 15], 16,      // 5-15 MW
                      ['<=', ['var', 'capacity'], 30], 24,      // 15-30 MW
                      ['<=', ['var', 'capacity'], 45], 32,      // 30-45 MW
                      40                                        // >45 MW
                    ],
                    'DE', [
                      'case',
                      ['<=', ['var', 'capacity'], 10], 8,      // 0-10 MW
                      ['<=', ['var', 'capacity'], 25], 16,      // 10-25 MW
                      ['<=', ['var', 'capacity'], 45], 24,      // 25-45 MW
                      ['<=', ['var', 'capacity'], 65], 32,      // 45-65 MW
                      40                                        // >65 MW
                    ],
                    'AU', [
                      'case',
                      ['<=', ['var', 'capacity'], 2.5], 8,      // 0-2.5 MW
                      ['<=', ['var', 'capacity'], 7.5], 16,      // 2.5-7.5 MW
                      ['<=', ['var', 'capacity'], 12.5], 24,      // 7.5-12.5 MW
                      ['<=', ['var', 'capacity'], 17.5], 32,      // 12.5-17.5 MW
                      40                                        // >17.5 MW
                    ],
                    'CO', [
                      'case',
                      ['<=', ['var', 'capacity'], 0.5], 8,       // 0-0.5 MW
                      ['<=', ['var', 'capacity'], 1.5], 16,       // 0.5-1.5 MW
                      ['<=', ['var', 'capacity'], 3], 24,        // 1.5-3 MW
                      ['<=', ['var', 'capacity'], 5], 32,        // 3-5 MW
                      40                                        // >5 MW
                    ],
                    'MX', [
                      'case',
                      ['<=', ['var', 'capacity'], 3], 8,       // 0-3 MW
                      ['<=', ['var', 'capacity'], 8], 16,       // 3-8 MW
                      ['<=', ['var', 'capacity'], 15], 24,       // 8-15 MW
                      ['<=', ['var', 'capacity'], 20], 32,       // 15-20 MW
                      40                                        // >20 MW
                    ],
                    'NG', [
                      'case',
                      ['<=', ['var', 'capacity'], 0.5], 8,       // 0-0.5 MW
                      ['<=', ['var', 'capacity'], 2], 16,        // 0.5-2 MW
                      ['<=', ['var', 'capacity'], 5], 24,         // 2-5 MW
                      ['<=', ['var', 'capacity'], 8], 32,         // 5-8 MW
                      40                                        // >8 MW
                    ],
                    'IT', [
                      'case',
                      ['<=', ['var', 'capacity'], 5], 8,       // 0-5 MW
                      ['<=', ['var', 'capacity'], 15], 16,       // 5-15 MW
                      ['<=', ['var', 'capacity'], 25], 24,        // 15-25 MW
                      ['<=', ['var', 'capacity'], 40], 32,        // 25-40 MW
                      40                                        // >40 MW
                    ],
                    'ZA', [
                      'case',
                      ['<=', ['var', 'capacity'], 2.5], 8,       // 0-2.5 MW
                      ['<=', ['var', 'capacity'], 10], 16,        // 2.5-10 MW
                      ['<=', ['var', 'capacity'], 20], 24,         // 10-20 MW
                      ['<=', ['var', 'capacity'], 35], 32,         // 20-35 MW
                      40                                        // >35 MW
                    ],
                    [
                      'case',
                      ['<=', ['var', 'capacity'], 1], 8,       // 0-1 MW
                      ['<=', ['var', 'capacity'], 5], 16,        // 1-5 MW
                      ['<=', ['var', 'capacity'], 10], 24,         // 5-10 MW
                      ['<=', ['var', 'capacity'], 15], 32,         // 10-15 MW
                      40                                        // >15 MW
                    ]
                  ],
                  [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false], STATE_MULTIPLIERS.SELECTED,
                    ['boolean', ['feature-state', 'hover'], false], STATE_MULTIPLIERS.HOVER,
                    STATE_MULTIPLIERS.BASE
                  ]
                ]
              ]
            ]
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 2,
            ['boolean', ['feature-state', 'hover'], false], 1,
            0
          ],
          'circle-stroke-color': '#ffffff'
        }
      });

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
    }
  }, [selectedCountry, busCapacities]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !isMounted) {
      return;
    }

    if (Object.keys(busCapacities).length > 0) {
      const styleLoadHandler = () => {
        updateMapData(map);
      };

      if (map.isStyleLoaded()) {
        styleLoadHandler();
      } else {
        map.once('style.load', styleLoadHandler);
      }
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [selectedCountry, mapLoaded, isMounted, busCapacities, updateMapData]);

  useEffect(() => {
    if (selectedCountry && mapLoaded) {
      loadBusCapacities(selectedCountry);
    }
  }, [selectedCountry, mapLoaded]);

  useEffect(() => {
    if (!mapContainerRef.current || initializeStartedRef.current || !isMounted || !mapStyle) return;
    
    initializeStartedRef.current = true;
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
      setMapLoaded(false);
      initializeStartedRef.current = false;
    };
  }, [theme, isMounted, mapStyle, selectedCountry]);

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