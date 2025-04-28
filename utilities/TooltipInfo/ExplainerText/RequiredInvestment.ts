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
    "A modeling output which represents an annualised value of capital expenditures needed to expand the generation infrastructure to meet the electricity demand in a cost-optimal way satisfying the net-zero constraint",
  unit: "Billion €",
  source:
    "A result of the optimisation run which accounts for the expected changes in the demand and the technologies costs",
  values: "An annulised value for the planning horizon",
  comparison:
    "A requirement investments value differs across the countries and depends on the electricity demand, the existing infrastructure and available renewable potentials",
};
