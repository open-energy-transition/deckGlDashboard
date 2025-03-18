import React from "react";
import {
  COUNTRY_S_NOM_RANGES,
  COUNTRY_BUS_CONFIGS,
} from "@/utilities/CountryConfig/Link";

interface MapLegendProps {
  country: string;
  theme: string;
  type?: "lines" | "buses";
  breaks?: Array<{
    group: number;
    min: number;
    max: number;
  }>;
}

const LINE_COLOR = [227, 26, 28];
const BUS_COLOR = [124, 152, 133];

const DEFAULT_RANGES = {
  min: 0,
  max: 1000,
};

const DEFAULT_BUS_CONFIG = {
  minRadius: 3,
  maxRadius: 20,
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
  if (normalized >= 2.5) return (Math.round(normalized * 2) * magnitude) / 2;
  return (Math.round(normalized * 5) * magnitude) / 5;
};

export default function MapLegend({
  country,
  theme,
  type = "lines",
  breaks,
}: MapLegendProps) {
  const validCountries = COUNTRY_S_NOM_RANGES
    ? Object.keys(COUNTRY_S_NOM_RANGES)
    : [];
  const isValidCountry = country && validCountries.includes(country);

  const countryRanges = isValidCountry
    ? COUNTRY_S_NOM_RANGES[country as keyof typeof COUNTRY_S_NOM_RANGES]
    : DEFAULT_RANGES;

  const calculateLegendBusSizes = () => {
    const minSize = 3;
    const maxSize = 20;
    const step = (maxSize - minSize) / 4;

    return {
      LARGE: maxSize,
      MEDIUM_LARGE: maxSize - step,
      MEDIUM: maxSize - (step * 2),
      MEDIUM_SMALL: maxSize - (step * 3),
      SMALL: minSize,
    };
  };

  const legendBusSizes = calculateLegendBusSizes();


  const lineCategories = [
    {
      label: `< ${formatPowerValue(roundToNiceNumber(countryRanges.min))}`,
      width: 0.2,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.min)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max / 4))}`,
      width: 0.4,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.max / 4)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max / 2))}`,
      width: 0.6,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.max / 2)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.75))}`,
      width: 0.8,
    },
    {
      label: `> ${formatPowerValue(
        roundToNiceNumber(countryRanges.max * 0.75)
      )}`,
      width: 1.0,
    },
  ];

  const busCategories = breaks ? [
    {
      label: `> ${formatPowerValue(roundToNiceNumber(breaks[4].max))}`,
      size: legendBusSizes.LARGE,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(breaks[3].min))} - ${formatPowerValue(roundToNiceNumber(breaks[3].max))}`,
      size: legendBusSizes.MEDIUM_LARGE,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(breaks[2].min))} - ${formatPowerValue(roundToNiceNumber(breaks[2].max))}`,
      size: legendBusSizes.MEDIUM,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(breaks[1].min))} - ${formatPowerValue(roundToNiceNumber(breaks[1].max))}`,
      size: legendBusSizes.MEDIUM_SMALL,
      color: BUS_COLOR,
    },
    {
      label: `< ${formatPowerValue(roundToNiceNumber(breaks[0].min))}`,
      size: legendBusSizes.SMALL,
      color: BUS_COLOR,
    },
  ] : [
    {
      label: `> ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.8))}`,
      size: legendBusSizes.LARGE,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.6))} - ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.8))}`,
      size: legendBusSizes.MEDIUM_LARGE,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.4))} - ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.6))}`,
      size: legendBusSizes.MEDIUM,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.2))} - ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.4))}`,
      size: legendBusSizes.MEDIUM_SMALL,
      color: BUS_COLOR,
    },
    {
      label: `< ${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.2))}`,
      size: legendBusSizes.SMALL,
      color: BUS_COLOR,
    },
  ];

  const renderTransmissionLines = () => {
    return (
      <div className="w-full">
        {lineCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0.5">
            <div
              className="w-8 h-0 mr-2"
              style={{
                borderTop: `${Math.max(
                  1,
                  cat.width * 6
                )}px solid rgba(${LINE_COLOR.join(",")}, 0.8)`,
              }}
            />
            <span className="text-xs">{cat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBuses = () => {
    return (
      <div className="w-full">
        {busCategories.map((bus, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0.5">
            <div
              className="mr-2 rounded-full flex-shrink-0"
              style={{
                width: Math.max(4, bus.size * 0.75),
                height: Math.max(4, bus.size * 0.75),
                backgroundColor: `rgba(${bus.color.join(",")}, 1)`,
              }}
            />
            <span className="text-xs">{bus.label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (type === "lines") return renderTransmissionLines();
  if (type === "buses") return renderBuses();
  return (
    <div>
      {renderTransmissionLines()}
      {renderBuses()}
    </div>
  );
}
