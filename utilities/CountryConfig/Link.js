const API_BASE_URL = "/api/geography";

export const toLowerCase = (str) => str.toLowerCase();

export const COUNTRY_COLORS = {
  br: "#D41E3C", // Bright red
  co: "#E4351F", // Red-orange
  de: "#E42D4F", // Deep pink
  in: "#E41F2A", // Pure red
  it: "#D82836", // Cherry red
  mx: "#C1272D", // Dark red
  ng: "#FF1E3C", // Vivid red
  us: "#E63946", // American red
  za: "#DC143C", // Crimson
};

export const getGeoJsonData = (countryCode) => {
  const code = countryCode.toLowerCase();
  return {
    buses: `${API_BASE_URL}/buses/${code}`,
    lines: `${API_BASE_URL}/lines/${code}`,
    countryView: `${API_BASE_URL}/countryView/${code}`,
    regions: `${API_BASE_URL}/regions/${code}`,
    regions_2021: `${API_BASE_URL}/regions/${code}?year=2021`,
    regions_2050: `${API_BASE_URL}/regions/${code}?year=2050`
  };
};

export const COUNTRY_S_NOM_RANGES = {
  BR: { min: 231.25476357255866, max: 87594.814965592, bussize: 20 },
  AU: { min: 73.73340287820712, max: 19797.41867279861, bussize: 20 },
  MX: { min: 128.47486865142147, max: 23184.127927727168, bussize: 30 },
  IN: { min: 442.40041726924267, max: 255263.7936877715, bussize: 50 },
  ZA: { min: 221.20020863462133, max: 60830.05737452085, bussize: 30 },
  US: { min: 77.08492119085288, max: 47510.006427295666, bussize: 70 },
  CO: { min: 368.66701439103554, max: 13774.740264974147, bussize: 15 },
  NG: { min: 147.46680575641423, max: 13272.012518077277, bussize: 25 },
  IT: { min: 147.46680575641423, max: 20153.796786709947, bussize: 18 },
  DE: { min: 245.7780095940237, max: 46094.54852658827, bussize: 22 },
};

export const LINE_WIDTH_RANGE = {
  BR: { min: 231.25476357255866, max: 87594.814965592 },
  AU: { min: 73.73340287820712, max: 19797.41867279861 },
  MX: { min: 128.47486865142147, max: 23184.127927727168 },
  IN: { min: 442.40041726924267, max: 255263.7936877715 },
  ZA: { min: 221.20020863462133, max: 60830.05737452085 },
  US: { min: 77.08492119085288, max: 47510.006427295666 },
  CO: { min: 368.66701439103554, max: 13774.740264974147 },
  NG: { min: 147.46680575641423, max: 13272.012518077277 },
  IT: { min: 147.46680575641423, max: 20153.796786709947 },
  DE: { min: 245.7780095940237, max: 46094.54852658827 },
};

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

export const COUNTRY_BOUNDS = {
  AU: [[113.338953078, -43.6345972634], [153.569469029, -10.6681857235]],
  BR: [[-73.9872354804, -33.7683777809], [-34.7299934555, 5.24448639569]],
  CO: [[-78.9909352282, -4.29818694419], [-66.8763258531, 12.4373031682]],
  DE: [[5.98865807458, 47.3024876979], [15.0169958839, 54.983104153]],
  IN: [[68.1766451354, 7.96553477623], [97.4025614766, 35.4940095078]],
  IT: [[6.7499552751, 36.619987291], [18.4802470232, 47.1153931748]],
  MX: [[-118.3649820989, 14.5321824761], [-86.7235489749, 32.7187629611]],
  NG: [[2.6917863124, 4.2790553552], [14.6800013683, 13.8659239771]],
  US: [[-178.334698, 18.910361], [-66.94524, 71.352561]],
  ZA: [[16.3449768409, -34.8191663551], [32.830120477, -22.1265453832]],
};

export const COUNTRY_NAMES = {
  AU: "Australia",
  BR: "Brazil",
  CO: "Colombia",
  DE: "Germany",
  IN: "India",
  IT: "Italy",
  MX: "Mexico",
  NG: "Nigeria",
  US: "United States",
  ZA: "South Africa",
};

export const COUNTRY_BUS_RANGES = {
  US: {  // max: 180499 MW, min: 136 MW
    ranges: [
      { min: 0, max: 20, radius: 4 },        // 0-20 MW
      { min: 20, max: 50, radius: 8 },       // 20-50 MW
      { min: 50, max: 100, radius: 12 },     // 50-100 MW
      { min: 100, max: 150, radius: 16 },    // 100-150 MW
      { min: 150, max: Infinity, radius: 20 } // >150 MW
    ],
    zoomFactor: 1.2
  },
  IN: {  // max: 114113 MW, min: 183 MW
    ranges: [
      { min: 0, max: 15, radius: 4 },       // 0-15 MW
      { min: 15, max: 35, radius: 8 },      // 15-35 MW
      { min: 35, max: 60, radius: 12 },     // 35-60 MW
      { min: 60, max: 90, radius: 16 },     // 60-90 MW
      { min: 90, max: Infinity, radius: 20 } // >90 MW
    ],
    zoomFactor: 1.2
  },
  BR: {  // max: 55377 MW, min: 28 MW
    ranges: [
      { min: 0, max: 5, radius: 4 },        // 0-5 MW
      { min: 5, max: 15, radius: 8 },       // 5-15 MW
      { min: 15, max: 30, radius: 12 },     // 15-30 MW
      { min: 30, max: 45, radius: 16 },     // 30-45 MW
      { min: 45, max: Infinity, radius: 20 } // >45 MW
    ],
    zoomFactor: 1.2
  },
  DE: {  // max: 83846 MW, min: 2572 MW
    ranges: [
      { min: 0, max: 10, radius: 4 },       // 0-10 MW
      { min: 10, max: 25, radius: 8 },      // 10-25 MW
      { min: 25, max: 45, radius: 12 },     // 25-45 MW
      { min: 45, max: 65, radius: 16 },     // 45-65 MW
      { min: 65, max: Infinity, radius: 20 } // >65 MW
    ],
    zoomFactor: 1.2
  },
  MX: {  // max: 26155 MW, min: 139 MW
    ranges: [
      { min: 0, max: 3, radius: 4 },        // 0-3 MW
      { min: 3, max: 8, radius: 8 },        // 3-8 MW
      { min: 8, max: 15, radius: 12 },      // 8-15 MW
      { min: 15, max: 20, radius: 16 },     // 15-20 MW
      { min: 20, max: Infinity, radius: 20 } // >20 MW
    ],
    zoomFactor: 1.2
  },
  AU: {  // max: 21507 MW, min: 5.88 MW
    ranges: [
      { min: 0, max: 2.5, radius: 4 },      // 0-2.5 MW
      { min: 2.5, max: 7.5, radius: 8 },    // 2.5-7.5 MW
      { min: 7.5, max: 12.5, radius: 12 },  // 7.5-12.5 MW
      { min: 12.5, max: 17.5, radius: 16 }, // 12.5-17.5 MW
      { min: 17.5, max: Infinity, radius: 20 } // >17.5 MW
    ],
    zoomFactor: 1.2
  },
  IT: {  // max: 53326 MW, min: 78 MW
    ranges: [
      { min: 0, max: 5, radius: 4 },        // 0-5 MW
      { min: 5, max: 15, radius: 8 },       // 5-15 MW
      { min: 15, max: 25, radius: 12 },     // 15-25 MW
      { min: 25, max: 40, radius: 16 },     // 25-40 MW
      { min: 40, max: Infinity, radius: 20 } // >40 MW
    ],
    zoomFactor: 1.2
  },
  ZA: {  // max: 40780 MW, min: 108 MW
    ranges: [
      { min: 0, max: 2.5, radius: 4 },      // 0-2.5 MW
      { min: 2.5, max: 10, radius: 8 },     // 2.5-10 MW
      { min: 10, max: 20, radius: 12 },     // 10-20 MW
      { min: 20, max: 35, radius: 16 },     // 20-35 MW
      { min: 35, max: Infinity, radius: 20 } // >35 MW
    ],
    zoomFactor: 1.2
  },
  CO: {  // max: 6670 MW, min: 2.16 MW
    ranges: [
      { min: 0, max: 0.5, radius: 4 },      // 0-0.5 MW
      { min: 0.5, max: 1.5, radius: 8 },    // 0.5-1.5 MW
      { min: 1.5, max: 3, radius: 12 },     // 1.5-3 MW
      { min: 3, max: 5, radius: 16 },       // 3-5 MW
      { min: 5, max: Infinity, radius: 20 }  // >5 MW
    ],
    zoomFactor: 1.2
  },
  NG: {  // max: 10411 MW, min: 0.87 MW
    ranges: [
      { min: 0, max: 0.5, radius: 4 },      // 0-0.5 MW
      { min: 0.5, max: 2, radius: 8 },      // 0.5-2 MW
      { min: 2, max: 5, radius: 12 },       // 2-5 MW
      { min: 5, max: 8, radius: 16 },       // 5-8 MW
      { min: 8, max: Infinity, radius: 20 }  // >8 MW
    ],
    zoomFactor: 1.2
  }
};