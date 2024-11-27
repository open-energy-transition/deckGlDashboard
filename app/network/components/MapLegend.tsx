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

const MapLegend: React.FC<MapLegendProps> = ({ country = 'US', theme }) => {
  const validCountries = COUNTRY_S_NOM_RANGES ? Object.keys(COUNTRY_S_NOM_RANGES) : [];
  const isValidCountry = country && validCountries.includes(country);
  
  const countryRanges = isValidCountry 
    ? COUNTRY_S_NOM_RANGES[country as keyof typeof COUNTRY_S_NOM_RANGES] 
    : DEFAULT_RANGES;
  

  const busConfig = isValidCountry 
    ? COUNTRY_BUS_CONFIGS[country as keyof typeof COUNTRY_BUS_CONFIGS] 
    : DEFAULT_BUS_CONFIG;

  const LEGEND_BUS_SIZES = {
    LARGE: 16,
    MEDIUM: 12,
    SMALL: 8
  };
  
  const lineCategories = [
    { 
      label: `< ${Math.round(countryRanges.min)} MW`, 
      width: 0.2 
    },
    { 
      label: `${Math.round(countryRanges.min)}-${Math.round(countryRanges.max/4)} MW`, 
      width: 0.4 
    },
    { 
      label: `${Math.round(countryRanges.max/4)}-${Math.round(countryRanges.max/2)} MW`, 
      width: 0.6 
    },
    { 
      label: `${Math.round(countryRanges.max/2)}-${Math.round(countryRanges.max*0.75)} MW`, 
      width: 0.8 
    },
    { 
      label: `> ${Math.round(countryRanges.max*0.75)} MW`, 
      width: 1.0 
    }
  ];
  
  const busCategories = [
    { 
      label: `> ${Math.round(countryRanges.max * 0.7)} MW`, 
      size: LEGEND_BUS_SIZES.LARGE,
      color: BUS_COLOR
    },
    { 
      label: `${Math.round(countryRanges.max * 0.3)}-${Math.round(countryRanges.max * 0.7)} MW`, 
      size: LEGEND_BUS_SIZES.MEDIUM,
      color: BUS_COLOR
    },
    { 
      label: `< ${Math.round(countryRanges.max * 0.3)} MW`, 
      size: LEGEND_BUS_SIZES.SMALL,
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