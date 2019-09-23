import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider as CrossFilterProvider, createIndex } from '../crossfilter';
import MapLayout from './map-layout.component';
import { testExtents, testProperties } from '../crossfilter/test-data';
import { data } from '../metadata/histograms';

const mockStore = configureMockStore([thunk]);

describe('Map Layout Component', () => {
  let index;

  beforeEach(() => {
    fetch.resetMocks();

    index = createIndex();
    index.addBoundingBoxRecords(testExtents);
    const fuelPoverty = data[2].categories[2].properties[0];
    const fuelPovertyChange = data[2].categories[2].properties[1];
    fetch.mockResponse(JSON.stringify(testProperties));
    index.addProperty(fuelPoverty);
    index.addProperty(fuelPovertyChange);
  });

  afterEach(cleanup);

  it('should render a single map', () => {
    const store = mockStore({
      map: {
        selectedMapStyle: {},
        infrastructureLayers: [],
        customLayers: [],
        isMultiMapMode: false
      },
      factsheet: {
        selectedFeatures: [],
        data: {}
      }
    });
    const { container } = render(
      <Provider store={store}>
        <CrossFilterProvider index={index}>
          <MapLayout />
        </CrossFilterProvider>
      </Provider>
    );

    expect(container.querySelector('.layout-1')).toBeInTheDocument();
  });

  it('should render multiple maps', () => {
    const store = mockStore({
      map: {
        selectedMapStyle: {},
        infrastructureLayers: [],
        customLayers: [],
        isMultiMapMode: true
      },
      factsheet: {
        selectedFeatures: [],
        data: {}
      }
    });

    const { debug, container } = render(
      <Provider store={store}>
        <CrossFilterProvider index={index}>
          <MapLayout />
        </CrossFilterProvider>
      </Provider>
    );

    expect(container.querySelector('.layout-2')).toBeInTheDocument();
  });
});
