import React from 'react';
import { COUNTRY_BUS_CONFIGS } from '../MainMap';
import { COUNTRY_S_NOM_RANGES } from './Links';

interface MapLegendProps {
  country: string;
  theme: string;
}

const LINE_COLOR = [227, 26, 28];
const BUS_COLOR = [72, 123, 182];

const DEFAULT_RANGES = {
  min: 500,
  max: 20000,
  bussize: 20
};

const DEFAULT_BUS_CONFIG = {
  minRadius: 3000,
  maxRadius: 10000,
  zoomBase: 1.2
};

const formatPowerValue = (value: number): string => {
  const gva = value / 1000;
  
  if (gva >= 10) {
    return `${Math.round(gva)} GVA`;
  } else if (gva >= 1) {
    return `${Number(gva.toFixed(1))} GVA`;
  } else {
    return `${Math.round(value)} MW`;
  }
};

const roundToNiceNumber = (value: number): number => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  
  if (normalized >= 7.5) return Math.round(normalized) * magnitude;
  if (normalized >= 2.5) return Math.round(normalized * 2) * magnitude / 2;
  return Math.round(normalized * 5) * magnitude / 5;
};

const MapLegend: React.FC<MapLegendProps> = ({ country = 'US', theme }) => {
  const validCountries = COUNTRY_S_NOM_RANGES ? Object.keys(COUNTRY_S_NOM_RANGES) : [];
  const isValidCountry = country && validCountries.includes(country);
  
  const countryRanges = isValidCountry 
    ? COUNTRY_S_NOM_RANGES[country as keyof typeof COUNTRY_S_NOM_RANGES] 
    : DEFAULT_RANGES;
  

  const busConfig = isValidCountry 
    ? COUNTRY_BUS_CONFIGS[country as keyof typeof COUNTRY_BUS_CONFIGS] 
    : DEFAULT_BUS_CONFIG;

  const calculateLegendBusSizes = (busConfig: typeof DEFAULT_BUS_CONFIG) => {
    const scaleFactor = 16 / busConfig.maxRadius * 1000;
    
    return {
      LARGE: Math.max(6, Math.min(20, busConfig.maxRadius * scaleFactor)),
      MEDIUM: Math.max(4, Math.min(16, (busConfig.maxRadius + busConfig.minRadius) / 2 * scaleFactor)),
      SMALL: Math.max(3, Math.min(12, busConfig.minRadius * scaleFactor))
    };
  };

  const legendBusSizes = calculateLegendBusSizes(busConfig);
  
  const lineCategories = [
    { 
      label: `< ${formatPowerValue(roundToNiceNumber(countryRanges.min))}`, 
      width: 0.2 
    },
    { 
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.min))}-${formatPowerValue(roundToNiceNumber(countryRanges.max/4))}`, 
      width: 0.4 
    },
    { 
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max/4))}-${formatPowerValue(roundToNiceNumber(countryRanges.max/2))}`, 
      width: 0.6 
    },
    { 
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max/2))}-${formatPowerValue(roundToNiceNumber(countryRanges.max*0.75))}`, 
      width: 0.8 
    },
    { 
      label: `> ${formatPowerValue(roundToNiceNumber(countryRanges.max*0.75))}`, 
      width: 1.0 
    }
  ];
  
  const busCategories = [
    { 
      label: `> ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.7))}`, 
      size: legendBusSizes.LARGE,
      color: BUS_COLOR
    },
    { 
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.3))}-${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.7))}`, 
      size: legendBusSizes.MEDIUM,
      color: BUS_COLOR
    },
    { 
      label: `< ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.3))}`, 
      size: legendBusSizes.SMALL,
      color: BUS_COLOR
    }
  ];

  return (
    <div className={`absolute bottom-24 right-4 p-4 rounded-lg 
      ${theme === 'dark' 
        ? 'bg-foreground text-background' 
        : 'bg-foreground text-background'
      }`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 px-2">Transmission Lines</h3>
        {lineCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center mb-1 px-2 py-1 rounded-md">
            <div 
              className="w-12 h-0 mr-2" 
              style={{
                borderTop: `${Math.max(2, cat.width * 8)}px solid rgba(${LINE_COLOR.join(',')}, 0.8)`,
              }}
            />
            <span className="text-sm">{cat.label}</span>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 px-2">Buses</h3>
        {busCategories.map((bus, idx) => (
          <div key={idx} className="flex items-center mb-1 px-2 py-1 rounded-md">
            <div 
              className="mr-2 rounded-full"
              style={{
                width: bus.size,
                height: bus.size,
                backgroundColor: `rgba(${bus.color.join(',')}, 1)`,
              }}
            />
            <span className="text-sm">{bus.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend; 