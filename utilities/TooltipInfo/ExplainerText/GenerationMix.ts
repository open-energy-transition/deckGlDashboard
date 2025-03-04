/**
 * Type definition for generation mix information display
 * @typedef {Object} Generation_info_type
 * @property {string} full_name - The complete name/title of the generation type
 * @property {string} definition - Detailed explanation of what this generation type represents
 * @property {string} unit - The unit of measurement (e.g., MW, GWh, %)
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares to other metrics/periods
 */
export type Generation_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const Generation_info: Generation_info_type = {
  full_name: "Generation Mix",
  definition:
    "The Generation Mix is the proportion of electricity generated from different sources, such as coal, natural gas, wind, solar, and hydro.",
  unit: "TWh (terawatt-hours, a measure of energy)",
  source: "Technologies used to generate electricity",
  values: "energy production",
  comparison:
    "Changes in electricity production sources between scenarios, showing shifts in energy source proportions and overall generation volumes.",
};
