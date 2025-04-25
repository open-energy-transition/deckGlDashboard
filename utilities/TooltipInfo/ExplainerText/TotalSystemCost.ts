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
    "The Total System Cost is a modeling output which represents capital and operational costs needed to operate and expand the power system. Accounts for generation, transmission, and storage infrastructure which is needed to cover the power demand  in the most cost-optimal way",
  unit: "Billion €",
  source:
    "A result of the optimisation run which accounts for the expected changes in the demand and the technologies costs",
  values: "The displayed value includes annualized values of the capital costs for the whole national power system",
  comparison:
    "A requirement investments value differs across the countries and depends on the electricity demand, the existing infrastructure and available renewable potentials",
};
