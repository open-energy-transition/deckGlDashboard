export const formatPowerValue = (value: number): string => {
  const gva = value / 1000;

  if (gva >= 10) {
    return `${Math.round(gva)} GVA`;
  } else if (gva >= 1) {
    return `${Number(gva.toFixed(1))} GVA`;
  } else {
    return `${Math.round(value)} MVA`;
  }
}; 