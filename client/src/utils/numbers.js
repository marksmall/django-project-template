export const toDecimalPlaces = (value, places) => Number(Math.round(100 - value * 100 + `e${places}`) + `e-${places}`);
