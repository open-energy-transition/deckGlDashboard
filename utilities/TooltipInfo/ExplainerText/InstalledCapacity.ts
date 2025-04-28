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
    "Installed capacity refers to the rated capacity of electrical generators that have been commissioned in a specific area and are currently available to generate electricity.",
  unit: "GW",
  source:
    "Brownfield capacity for 2021 is extracted from available open databases, while the installed capacity values for 2050 are derived from the optimization run.",
  values:
    "Installed capacity represents the generation units available in the power system to meet electricity demand.",
  comparison:
    "Required Capacity Expansion refers to the adjustments in installed generation capacity necessary to meet future demand and achieve the net-zero target in a cost-effective manner.",
};
