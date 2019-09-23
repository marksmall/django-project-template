import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider as CrossFilterProvider } from '../crossfilter';
import { setupCrossFilterStore } from '../crossfilter/test-helpers';
import Map from './map.component';
import mapboxgl, { fireMapEvent } from 'mapbox-gl';

const mockStore = configureMockStore([thunk]);

const defaultProps = {
  style: 'mapbox://styles/thermcert/cjxzywxui08131cry0du0zn4v',
  colorScheme: ['red', 'green'],
  attribution: true,
  geocoder: true,
  navigation: true,
  scale: true,
  layoutInvalidation: 1,
  position: 1
};

const renderMap = async ({
  selectedProperty,
  is3DMode = false,
  allProperties = selectedProperty ? [selectedProperty] : []
}) => {
  const store = mockStore({
    map: {
      mapStyles: ['light'],
      selectedMapStyle: {},
      infrastructureLayers: [],
      customLayers: [],
      is3DMode
    },
    factsheet: {
      selectedFeatures: [],
      data: {}
    }
  });
  const index = await setupCrossFilterStore(allProperties);
  const result = render(
    <Map {...defaultProps} selectedProperty={selectedProperty} />,
    {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <CrossFilterProvider index={index}>{children}</CrossFilterProvider>
        </Provider>
      )
    }
  );

  fireMapEvent('load');

  return { ...result, map: mapboxgl.Map.mock.results[0].value };
};

describe('Map Component', () => {
  afterEach(() => {
    cleanup();
    mapboxgl.Map.mockClear();
  });

  it('should render a map based on the props', async () => {
    const { container } = await renderMap({ selectedProperty: null });
    expect(container.querySelector('.map')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="map-1"]')
    ).toBeInTheDocument();
  });

  it('should filter layer based on store filters', async () => {
    const { map } = await renderMap({
      selectedProperty: 'fuel_poverty_pct'
    });

    expect(map.setFilter).toHaveBeenCalledWith('lsoa', [
      'all',
      ['>=', ['get', 'fuel_poverty_pct'], 0],
      ['<', ['get', 'fuel_poverty_pct'], 50]
    ]);
  });

  it('should filter layer based on store filters in 3D mode', async () => {
    const { map } = await renderMap({
      selectedProperty: 'fuel_poverty_pct',
      is3DMode: true
    });

    expect(map.setFilter).toHaveBeenCalledWith('lsoa-extrusion', [
      'all',
      ['>=', ['get', 'fuel_poverty_pct'], 0],
      ['<', ['get', 'fuel_poverty_pct'], 50]
    ]);
  });

  it('should set the proper color scale when props change', async () => {
    const { rerender, map } = await renderMap({
      selectedProperty: 'fuel_poverty_pct',
      allProperties: ['fuel_poverty_pct', 'imd_overall_decile']
    });

    rerender(<Map {...defaultProps} selectedProperty="imd_overall_decile" />);

    expect(map.setPaintProperty).toHaveBeenCalledWith(
      'lsoa',
      'fill-color',
      expect.arrayContaining([
        expect.arrayContaining([['get', 'imd_overall_decile']])
      ])
    );
  });

  it('should set the proper color scale and height when props change in 3D mode', async () => {
    const { rerender, map } = await renderMap({
      selectedProperty: 'fuel_poverty_pct',
      allProperties: ['fuel_poverty_pct', 'imd_overall_decile'],
      is3DMode: true
    });

    rerender(<Map {...defaultProps} selectedProperty="imd_overall_decile" />);

    expect(map.setPaintProperty).toHaveBeenCalledWith(
      'lsoa-extrusion',
      'fill-extrusion-color',
      expect.arrayContaining([
        expect.arrayContaining([['get', 'imd_overall_decile']])
      ])
    );

    expect(map.setPaintProperty).toHaveBeenCalledWith(
      'lsoa-extrusion',
      'fill-extrusion-height',
      expect.arrayContaining([
        expect.arrayContaining([['get', 'imd_overall_decile']])
      ])
    );
  });
});
