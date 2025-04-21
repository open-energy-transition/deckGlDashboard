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
    "Installed Capacity represents the rated capacity of electrical generators which are commissioned in a particular area.",
  unit: "GW (gigawatts)",
  source: "Brownfield capacities are extracted from the available open databases which implies also geospatial information needed to represent the spatial structure of the power system. Modeled values of the installed capacity is a result of the optimization run.",
  values: "maximum potential power output",
  comparison:
    "Changes in installed capacity between now and 2050 and what capacity expansions are needed to meet future net-zero demand.",
};
