export const toDecimalPlaces = (value, places) => Number(Math.round(value + `e${places}`) + `e-${places}`);
