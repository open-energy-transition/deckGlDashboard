/**
 * Type definition for total system cost information display
 * @typedef {Object} TotalSystemCost_info_type
 * @property {string} full_name - The complete name/title of the cost metric
 * @property {string} definition - Detailed explanation of what total system cost represents
 * @property {string} unit - The unit of measurement (billions)
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares across scenarios
 */
export type TotalSystemCost_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const TotalSystemCost_info: TotalSystemCost_info_type = {
  full_name: "Total System Cost",
  definition:
    "The Total System Cost represents the complete economic cost of building and operating the entire electricity system, including generation, transmission, and distribution infrastructure.",
  unit: "Billion € (euros)",
  source:
    "Calculated from capital, operating, and maintenance costs of all system components",
  values: "Aggregated system-wide costs",
  comparison:
    "Distribution of total system costs across different horizons and the required investments.",
};
