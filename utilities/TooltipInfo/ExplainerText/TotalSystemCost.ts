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
  full_name: "Total System Costs",
  definition:
    "This value is a modeling output that represents the sum of all capital and operational expenditures required to operate and expand the power system. It accounts for generation, transmission, and storage infrastructure, whose operation is necessary to meet power demand in a cost-optimal manner.",
  unit: "Billion €",
  source:
    "A result of the optimization run that accounts for expected changes in demand and technology costs, as well as the spatio-temporal dynamics of available renewable potential and power transmission constraints.",
  values:
    "The displayed value represents the annualized system costs for the entire national power system.",
  comparison:
    "The required investment value varies across countries and depends on electricity demand, existing infrastructure, and available renewable potentials.",
};
