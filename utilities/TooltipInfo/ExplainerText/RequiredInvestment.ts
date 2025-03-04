/**
 * Type definition for required investment information display
 * @typedef {Object} Investment_info_type
 * @property {string} full_name - The complete name/title of the investment metric
 * @property {string} definition - Detailed explanation of what this investment represents
 * @property {string} unit - The unit of measurement (billions)
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares across scenarios
 */
export type Investment_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const Investment_info: Investment_info_type = {
  full_name: "Required Investment",
  definition:
    "The total capital investment required for energy infrastructure, including costs for new power plants, grid infrastructure, and renewable energy facilities.",
  unit: "Billion USD ($)",
  source: "Financial projections and cost estimates for energy infrastructure",
  values: "capital expenditure requirements",
  comparison:
    "Comparison of investment needs across different scenarios, showing varying levels of required capital allocation for energy transition.",
};
