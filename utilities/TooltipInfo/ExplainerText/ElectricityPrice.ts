/**
 * Type definition for electricity price information display
 * @typedef {Object} ElectricityPrice_info_type
 * @property {string} full_name - The complete name/title of the price metric
 * @property {string} definition - Detailed explanation of what electricity price represents
 * @property {string} unit - The unit of measurement
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares across scenarios
 */
export type ElectricityPrice_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const ElectricityPrice_info: ElectricityPrice_info_type = {
  full_name: "Electricity Price",
  definition:
    "A displayed electricity price is an annual average value of costs needed to cover the energy demand at every particular moment.",
  unit: "€/MWh (euros per megawatt-hour)",
  source:
    "The electricity price are evaluated as result of optimisation considered operation and capital costs of generation, transmission and storage",
  values: "An average values of electricity prices",
  comparison:
    "Electricity prices depends in particular on the features of power demand and available renewable potentials",
};
