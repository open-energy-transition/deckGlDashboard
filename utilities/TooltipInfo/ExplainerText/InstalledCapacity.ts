/**
 * Type definition for installed capacity information display
 * @typedef {Object} Installed_capacity_info_type
 * @property {string} full_name - The complete name/title of the capacity type
 * @property {string} definition - Detailed explanation of what installed capacity represents
 * @property {string} unit - The unit of measurement (e.g., GW)
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares to other metrics/periods
 */
export type Installed_capacity_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const Installed_capacity_info: Installed_capacity_info_type = {
  full_name: "Installed Capacity",
  definition:
    "Installed Capacity represents the maximum potential output of electricity that can be produced by power plants when operating at full capacity.",
  unit: "GW (gigawatts, a measure of power capacity)",
  source: "Power plant capacity data by technology type",
  values: "maximum potential power output",
  comparison:
    "Changes in installed capacity between scenarios, showing differences in potential power generation capability across different technologies.",
};
