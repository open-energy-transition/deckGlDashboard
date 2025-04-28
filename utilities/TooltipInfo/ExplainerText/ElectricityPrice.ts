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
    "A displayed value is an average of hourly prices across all nodes in the power system.",
  unit: "€/MWh",
  source:
    "Electricity prices are determined as the result of an optimization that considers the operational and capital costs of generation, transmission, and storage required to meet power demand at every moment.",
  values: "The annual average of hourly electricity prices.",
  comparison:
    "Electricity prices depend on the spatio-temporal characteristics of power demand, available renewable potential, and the topology and capacity of the power grid.",
};
