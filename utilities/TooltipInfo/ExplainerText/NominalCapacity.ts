/**
 * Type definition for nominal capacity information display
 * @typedef {Object} NominalCapacity_info_type
 * @property {string} full_name - The complete name/title of the capacity type
 * @property {string} definition - Detailed explanation of what nominal capacity represents
 * @property {string} unit - The unit of measurement (GW)
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares to other metrics/periods
 */
export type NominalCapacity_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const NominalCapacity_info: NominalCapacity_info_type = {
  full_name: "Nominal Capacity",
  definition:
    "Nominal Capacity represents the maximum power output of electricity generation facilities under normal operating conditions, indicating the total installed capacity of power plants.",
  unit: "GW (gigawatts, a measure of power capacity)",
  source: "Installed power generation facilities",
  values: "maximum power output capacity",
  comparison:
    "Differences in installed capacity between scenarios, showing changes in potential power generation capabilities across different technologies.",
};
