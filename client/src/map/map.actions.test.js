import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import STORMS from '../data/storms.json';
import STORM from '../data/storm.json';
import SATELLITE_TIMESTAMPS from '../data/satellite-timestamps.json';

import {
  STORMS_REQUESTED,
  STORMS_REQUESTED_SUCCESS,
  STORMS_REQUESTED_FAILURE,
  STORM_REQUESTED,
  STORM_REQUESTED_SUCCESS,
  STORM_REQUESTED_FAILURE,
  SATELLITE_TIMESTAMPS_REQUESTED,
  SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
  SATELLITE_TIMESTAMPS_REQUESTED_FAILURE,
  MODEL_SELECTED,
  STORM_POINT_SELECTED,
  MODEL_HOVERED_OVER,
  fetchStorms,
  fetchStorm,
  fetchSatelliteTimestamps
} from './map.actions';

import { SET_CURRENT_TIMESTAMP } from '../time-slider/time-slider.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Stormer Map Actions', () => {
  let beforeState;

  beforeEach(() => {
    beforeState = {
      isLoading: false,
      storms: null,
      currentStorm: null,
      selectedModel: null,
      selectedOperationalPoint: null,
      hoveredOverModel: null,
      hoveredOverNonOperationalStormTrack: null,
      mapHeight: '80vh',
      satelliteTimestamps: []
    };
  });

  xit('should dispatch request and success action(s) when fetchStorms is called', () => {
    fetch.once(JSON.stringify(STORMS)).once(JSON.stringify(STORM));
    const expectedActions = [
      { type: STORMS_REQUESTED },
      { type: STORMS_REQUESTED_SUCCESS, storms: STORMS },
      { type: STORM_REQUESTED },
      { type: STORM_REQUESTED_SUCCESS, storm: STORM },
      {
        type: SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
        timestamps: SATELLITE_TIMESTAMPS
      }
    ];

    const store = mockStore(beforeState);
    store.dispatch(fetchStorms());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch request and success action(s) when fetchStorm is called', () => {
    fetch.mockResponse(JSON.stringify(STORM));

    const timestamp = '2017-01-16T12:00:00Z';
    const expectedActions = [
      { type: STORM_REQUESTED },
      { type: SET_CURRENT_TIMESTAMP, timestamp },
      { type: STORM_REQUESTED_SUCCESS, name: '2018-wp-5', storm: STORM }
    ];

    const id = '2018-wp-5';
    const store = mockStore(beforeState);
    store.dispatch(fetchStorm(id)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch success action(s) when fetchSatelliteTimestamps is called', () => {
    fetch.mockResponse(JSON.stringify(SATELLITE_TIMESTAMPS));

    const expectedActions = [
      {
        type: SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
        timestamps: SATELLITE_TIMESTAMPS
      }
    ];

    const store = mockStore(beforeState);
    store.dispatch(fetchSatelliteTimestamps()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
