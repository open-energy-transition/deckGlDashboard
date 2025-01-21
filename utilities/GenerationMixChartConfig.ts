import { ChartConfig } from "@/components/ui/chart";

export const GenerationMixchartConfig = {
  Biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  Coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  Hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  "Natural gas": {
    label: "Natural gas",
    color: "hsl(var(--chart-CCGT))",
  },
  Nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "Other Fossil": {
    label: "Other Fossil",
    color: "hsl(var(--chart-oil))",
  },
  Solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  Wind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  PHS: {
    label: "PHS",
    color: "hsl(var(--chart-4))",
  },
  Oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
  Geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-geothermal))",
  },
  "Load shedding": {
    label: "Load shedding",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const GenerationMixchartConfigSmall = {
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  CCGT: {
    label: "Natural Gas",
    color: "hsl(var(--chart-CCGT))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "other fossil": {
    label: "Other Fossil",
    color: "hsl(var(--chart-oil))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  onwind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  offwind: {
    label: "Offshore Wind",
    color: "hsl(var(--chart-4))",
  },
  oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
  geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-geothermal))",
  },
  "load shedding": {
    label: "Load Shedding",
    color: "hsl(var(--chart-1))",
  },
  csp: {
    label: "CSP",
    color: "hsl(var(--chart-csp))",
  },
} satisfies ChartConfig;
