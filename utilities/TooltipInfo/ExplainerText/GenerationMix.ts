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
    "The generation mix is a distribution of electricity amounts generated from different energy sources, such as fossil fuels, nuclear, wind, solar, and hydro",
  unit: "TWh (terawatt-hours)",
  source: "Result of a cost optimisation modeling run",
  values: "A displayed value is an annual average",
  comparison:
    "A comparison of the generation mix the modeled values by PyPSA-Earth run and available statistics can be used as a way to validate the model",
};
