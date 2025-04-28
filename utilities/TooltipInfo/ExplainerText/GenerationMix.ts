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
    "The generation mix refers to the distribution of electricity produced from various energy sources, including fossil fuels, nuclear, wind, solar, and hydro.",
  unit: "TWh",
  source:
    "It is evaluated in a modeling run that optimizes the overall cost of power supply for the entire year.",
  values:
    "The displayed value is the annual average of the dispatch across all nodes of the power system.",
  comparison:
    "A comparison of the modeled generation mix with available statistics can serve as an effective metric for validating the model.",
};
