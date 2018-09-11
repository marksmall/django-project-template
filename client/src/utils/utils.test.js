import { toTwoDecimalPlaces } from './utils';

describe('Utils', () => {
  it('should return a Float value rounded to 2 decimal places', () => {
    const testValues = [
      { value: 1.004, response: 1.0 },
      { value: 1.444, response: 1.44 },
      { value: 1.445, response: 1.45 },
      { value: 1.449, response: 1.45 },
      { value: 1.345, response: 1.35 },
      { value: 1.005, response: 1.01 }
    ];
    testValues.forEach(testValue => {
      const response = toTwoDecimalPlaces(testValue.value);
      // console.log('Value to 2 decimal places: ', response);
      expect(response).toEqual(testValue.response);
    });
  });
});
