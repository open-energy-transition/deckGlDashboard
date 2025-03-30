/**
 * Type definition for required investment information display
 * @typedef {Object} RequiredInvestment_info_type
 * @property {string} full_name - The complete name/title of the investment metric
 * @property {string} definition - Detailed explanation of what required investment represents
 * @property {string} unit - The unit of measurement (billions)
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares across scenarios
 */
export type RequiredInvestment_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const RequiredInvestment_info: RequiredInvestment_info_type = {
  full_name: "Required Investment",
  definition:
    "The Required Investment represents the capital expenditure needed to build new generation, transmission, and distribution infrastructure to meet future electricity demand.",
  unit: "Billion € (euros)",
  source:
    "Calculated from projected capital costs of new system components and infrastructure",
  values:
    "Annual or cumulative investment requirements across the planning horizon",
  comparison:
    "Comparison of investment requirements across different scenarios, technologies, and time periods.",
};
