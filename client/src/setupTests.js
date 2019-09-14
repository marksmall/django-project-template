import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';

import './polyfills/flat-map';
import './polyfills/array-flat';
import './polyfills/object-fromEntries';

jest.mock('react-ga', () => ({
  event: jest.fn()
}));

global.fetch = fetchMock;
global.requestIdleCallback = jest.fn().mockImplementation(args => setTimeout(args, 0));
