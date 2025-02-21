import { formatPowerValue } from './formatters';
import type { Expression } from 'mapbox-gl';

export interface CapacityRange {
  min: number;
  max: number;
  radius: number;
  label: string;
}

export const calculateCapacityRanges = (capacities: number[]): CapacityRange[] => {
  if (!capacities.length) return [];

  const max = Math.max(...capacities);
  const min = Math.min(...capacities);
  
  // Base ranges for different zoom levels
  const baseRanges = [
    { min: 0, max: 0, radius: 4 },
    { min: 0.1, max: max * 0.2, radius: 6 },
    { min: max * 0.2, max: max * 0.4, radius: 8 },
    { min: max * 0.4, max: max * 0.6, radius: 10 },
    { min: max * 0.6, max: max * 0.8, radius: 12 },
    { min: max * 0.8, max: max, radius: 14 }
  ];

  return baseRanges.map(range => ({
    ...range,
    label: range.min === 0 ? '0 MVA' :
           range.max === max ? `> ${formatPowerValue(range.min)}` :
           `${formatPowerValue(range.min)}-${formatPowerValue(range.max)}`
  }));
};

export const getMapboxRadiusExpression = (capacities: number[]): Expression => {
  if (!capacities.length) return ['case', ['==', ['get', 'total_capacity'], 0], 3, 3];

  const max = Math.max(...capacities);
  
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    3, [
      'case',
      ['==', ['get', 'total_capacity'], 0], 3,
      ['interpolate',
        ['linear'],
        ['get', 'total_capacity'],
        0.1, 4,
        max * 0.2, 6,
        max * 0.4, 8,
        max * 0.6, 10,
        max * 0.8, 12,
        max, 14
      ]
    ],
    8, [
      'case',
      ['==', ['get', 'total_capacity'], 0], 5,
      ['interpolate',
        ['linear'],
        ['get', 'total_capacity'],
        0.1, 8,
        max * 0.2, 12,
        max * 0.4, 16,
        max * 0.6, 20,
        max * 0.8, 24,
        max, 28
      ]
    ]
  ];
}; 