/**
 * Type definition for bus information display
 * @typedef {Object} Bus_info_type
 * @property {string} full_name - The complete name/title of a bus in the power network
 * @property {string} definition - Detailed explanation of what a bus represents
 */
export type Bus_info_type = {
  full_name: string;
  definition: string;
};

export const Bus_info: Bus_info_type = {
  full_name: "Bus",
  definition:
    "In power systems, a bus is a node or junction point in the electrical network where multiple components such as generators, loads, and transmission lines connect.",
};
