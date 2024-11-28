export interface GeneratorData {
  Generator: string;
  p_nom: number;
  p_nom_opt: number;
  carrier: string;
  bus: string;
  country_code: string;
}

export interface SideDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: 'left' | 'right' | 'top' | 'bottom';
  data: {
    busId: string;
    countryCode: string;
  } | null;
} 