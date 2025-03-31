/**
 * Type definition for line information display
 * @typedef {Object} Line_info_type
 * @property {string} full_name - The complete name/title of the network line
 * @property {string} definition - Detailed explanation of what network lines represent in the system
 */
export type Line_info_type = {
  full_name: string;
  definition: string;
};

export const Line_info: Line_info_type = {
  full_name: "Transmission Line",
  definition:
    "Transmission lines are physical connections that carry electrical power between different parts of the grid.",
};
