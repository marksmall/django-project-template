export const toTwoDecimalPlaces = value =>
  parseFloat(String(Math.round(String(value) + 'e+2')) + 'e-2');
