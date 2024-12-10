const BASE_URL = "http://34.31.13.149:8000/geoserver/GIS_Dashboard/ows";

// write a function to conver string to lower case
export const toLowerCase = (str) => str.toLowerCase();

export const getGeoJsonData = (countryCode) => ({
  buses: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Abuses_${countryCode.toLowerCase()}&maxFeatures=10000&outputFormat=application%2Fjson`,
  lines: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Alines_${countryCode.toLowerCase()}&maxFeatures=10000&outputFormat=application%2Fjson`,
  regions_2021: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Aregions_${countryCode.toLowerCase()}_2021&maxFeatures=10000&outputFormat=application%2Fjson`,
  regions_2050: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Aregions_${countryCode.toLowerCase()}_2050&maxFeatures=10000&outputFormat=application%2Fjson`,
});

export const COUNTRY_COORDINATES = {
  // lat long
  AU: [-25.2744, 133.7751],
  BR: [-14.235, -51.9253],
  CO: [4.5709, -74.2973],
  DE: [51.1657, 10.4515],
  IN: [20.5937, 78.9629],
  IT: [41.8719, 12.5674],
  MX: [23.6345, -102.5528],
  NG: [9.082, 8.6753],
  US: [37.0902, -95.7129],
  ZA: [-30.5595, 22.9375],
};

export const COUNTRY_VIEW_CONFIG = {
  AU: { zoom: 3.2, bounds: 80 },   
  BR: { zoom: 3.2, bounds: 80 }, 
  CO: { zoom: 4.8, bounds: 40 },
  DE: { zoom: 4.8, bounds: 30 },   
  IN: { zoom: 3.8, bounds: 60 }, 
  IT: { zoom: 4.5, bounds: 30 },
  MX: { zoom: 4.0, bounds: 50 },
  NG: { zoom: 4.8, bounds: 40 },     
  US: { zoom: 2.5, bounds: 100 },    
  ZA: { zoom: 4.5, bounds: 50 },    
};
