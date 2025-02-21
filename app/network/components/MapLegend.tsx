import React, { useEffect, useState } from "react";
import { COUNTRY_BUS_CONFIGS } from "../MapboxNetwork";
import { COUNTRY_S_NOM_RANGES, COUNTRY_BUS_RANGES } from "@/utilities/CountryConfig/Link";
import { calculateCapacityRanges, type CapacityRange } from "../../../app/utilities/capacityRanges";

interface MapLegendProps {
  country: keyof typeof COUNTRY_BUS_RANGES;
  theme: string;
  type?: "lines" | "buses";
}

interface BusCategory {
  label: string;
  size: number;
  color: number[];
}

const LINE_COLOR = [227, 26, 28];
const BUS_COLOR = [124, 152, 133];

const DEFAULT_RANGES = {
  min: 500,
  max: 20000,
  bussize: 20,
};

const DEFAULT_BUS_CONFIG = {
  minRadius: 3000,
  maxRadius: 10000,
  zoomBase: 1.2,
};

const formatPowerValue = (value: number): string => {
  const gva = value / 1000;

  if (gva >= 10) {
    return `${Math.round(gva)} GVA`;
  } else if (gva >= 1) {
    return `${Number(gva.toFixed(1))} GVA`;
  } else {
    return `${Math.round(value)} MVA`;
  }
};

const roundToNiceNumber = (value: number): number => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;

  if (normalized >= 7.5) return Math.round(normalized) * magnitude;
  if (normalized >= 2.5) return (Math.round(normalized * 2) * magnitude) / 2;
  return (Math.round(normalized * 5) * magnitude) / 5;
};

const getBusCategories = (country: keyof typeof COUNTRY_BUS_RANGES): BusCategory[] => {
  const ranges = COUNTRY_BUS_RANGES[country]?.ranges || [];
  return ranges.map((range, index) => ({
    label: index === ranges.length - 1 
      ? `> ${range.min / 1000} GW`
      : `${range.min / 1000}-${range.max / 1000} GW`,
    size: range.radius * 2,
    color: BUS_COLOR
  })).reverse();
};

const MapLegend = ({ country, theme, type = "lines" }: MapLegendProps) => {
  const [busCategories, setBusCategories] = useState<CapacityRange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        console.log('Fetching bus data for country:', country);
        const response = await fetch(`/api/geography/buses/${country}`);
        const data = await response.json();
        console.log('Received bus data:', data);
        
        if (!data.features || !data.features.length) {
          console.log('No features found in data');
          return;
        }
        
        const capacities = data.features
          .map((f: any) => f.properties.total_capacity)
          .filter((c: number) => c > 0);
        
        if (capacities.length === 0) {
          console.log('No valid capacities found');
          return;
        }

        const categories = calculateCapacityRanges(capacities);
        console.log('Generated legend categories:', categories);
        setBusCategories(categories.reverse());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bus data:', error);
        setIsLoading(false);
      }
    };

    if (type === "buses") {
      fetchBusData();
    }
  }, [country, type]);

  const validCountries = COUNTRY_S_NOM_RANGES
    ? Object.keys(COUNTRY_S_NOM_RANGES)
    : [];
  const isValidCountry = country && validCountries.includes(country.toUpperCase());

  const countryRanges = isValidCountry
    ? COUNTRY_S_NOM_RANGES[country.toUpperCase() as keyof typeof COUNTRY_S_NOM_RANGES]
    : DEFAULT_RANGES;

  const busConfig = isValidCountry && COUNTRY_BUS_CONFIGS[country.toUpperCase() as keyof typeof COUNTRY_BUS_CONFIGS]
    ? COUNTRY_BUS_CONFIGS[country.toUpperCase() as keyof typeof COUNTRY_BUS_CONFIGS]
    : DEFAULT_BUS_CONFIG;

  const calculateLegendBusSizes = (busConfig: typeof DEFAULT_BUS_CONFIG) => {
    return {
      VERY_LARGE: 16,
      LARGE: 14,
      MEDIUM: 10,
      SMALL: 6,
      VERY_SMALL: 4
    };
  };

  const legendBusSizes = calculateLegendBusSizes(busConfig);

  const lineCategories = [
    {
      label: `< ${formatPowerValue(roundToNiceNumber(countryRanges.min))}`,
      width: 0.2,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.min))}-${formatPowerValue(roundToNiceNumber(countryRanges.max / 4))}`,
      width: 0.4,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max / 4))}-${formatPowerValue(roundToNiceNumber(countryRanges.max / 2))}`,
      width: 0.6,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max / 2))}-${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.75))}`,
      width: 0.8,
    },
    {
      label: `> ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.75))}`,
      width: 1.0,
    },
  ];

  const renderTransmissionLines = () => {
    return (
      <div className="w-full">
        {lineCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0">
            <div
              className="w-8 h-0 mr-3"
              style={{
                borderTop: `${Math.max(1, cat.width * 6)}px solid rgba(${LINE_COLOR.join(",")}, 0.8)`,
              }}
            />
            <span className="text-sm">{cat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBuses = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="w-full">
        {busCategories.map((bus, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0">
            <div
              className="mr-3 rounded-full flex-shrink-0"
              style={{
                width: bus.radius * 2,
                height: bus.radius * 2,
                backgroundColor: `rgba(${BUS_COLOR.join(",")}, 1)`,
              }}
            />
            <span className="text-sm">{bus.label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (type === "lines") return renderTransmissionLines();
  if (type === "buses") return renderBuses();

  return null;
}

export default MapLegend;
