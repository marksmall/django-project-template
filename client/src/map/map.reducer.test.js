import STORMS from '../data/storms.json';
import STORM from '../data/storm.json';

import reducer from './map.reducer';
import {
  SATELLITE_TIMESTAMPS_REQUESTED,
  SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
  SATELLITE_TIMESTAMPS_REQUESTED_FAILURE,
  STORMS_REQUESTED,
  STORMS_REQUESTED_SUCCESS,
  STORMS_REQUESTED_FAILURE,
  STORM_REQUESTED,
  STORM_REQUESTED_SUCCESS,
  STORM_REQUESTED_FAILURE,
  MODEL_SELECTED,
  STORM_POINT_SELECTED,
  MODEL_HOVERED_OVER
} from './map.actions';

describe('Stormer Map reducer', () => {
  let beforeState;

  beforeEach(() => {
    beforeState = {
      isLoading: true,
      storms: null,
      currentStorm: null,
      selectedModel: null,
      selectedOperationalPoint: null,
      hoveredOverModel: null,
      hoveredOverNonOperationalStormTrack: null,
      satelliteTimestamps: [],
      error: null
    };
  });

  it('should return the initial state', () => {
    const actualState = reducer(undefined, {});

    expect(actualState).toEqual(expect.objectContaining(beforeState));
  });

  it('should set satellite timestamps state', () => {
    const timestamps = [
      '2000-01-01T00:00:00Z',
      '2000-01-01T01:00:00Z',
      '2000-01-01T02:00:00Z'
    ];
    const actualState = reducer(beforeState, {
      type: SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
      timestamps
    });

    expect(actualState.error).toEqual(null);
    expect(actualState.satelliteTimestamps).toEqual(timestamps);
  });

  it('should display error after failing to get satellite timestamps', () => {
    const error = { message: 'This is an error', type: 404 };
    const actualState = reducer(beforeState, {
      type: SATELLITE_TIMESTAMPS_REQUESTED_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
    expect(actualState.satelliteTimestamps).toEqual([]);
  });

  it('should set storms state', () => {
    const actualState = reducer(beforeState, {
      type: STORMS_REQUESTED_SUCCESS,
      storms: STORMS
    });

    expect(actualState.error).toEqual(null);
    expect(actualState.storms).toEqual(STORMS);
  });

  it('should display error after failing to get storms data', () => {
    const error = { message: 'This is an error', type: 404 };
    const actualState = reducer(beforeState, {
      type: STORMS_REQUESTED_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
    expect(actualState.storms).toEqual(null);
  });

  it('should render loading mask while getting single storm data', () => {
    const actualState = reducer(beforeState, { type: STORM_REQUESTED });

    expect(actualState.error).toEqual(null);
    expect(actualState.currentStorm).toEqual(null);
    expect(actualState.isLoading).toEqual(true);
  });

  it('should switch off loading mask after getting single storm data', () => {
    const actualState = reducer(beforeState, {
      type: STORM_REQUESTED_SUCCESS,
      storm: STORM
    });

    expect(actualState.error).toEqual(null);
    expect(actualState.currentStorm).toEqual(STORM);
    expect(actualState.isLoading).toEqual(false);
  });

  it('should display error after failing to get single storm data', () => {
    const error = { message: 'This is an error', type: 404 };
    const actualState = reducer(beforeState, {
      type: STORM_REQUESTED_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
    expect(actualState.currentStorm).toEqual(null);
    expect(actualState.isLoading).toEqual(false);
  });

  it('should set the id of the selected model', () => {
    const modelId = 'GFS';
    const actualState = reducer(beforeState, {
      type: MODEL_SELECTED,
      modelId
    });

    expect(actualState.selectedModel).toEqual(modelId);
  });

  it('should set the id of the hovered over model', () => {
    const modelId = 'GFS';
    const actualState = reducer(beforeState, {
      type: MODEL_HOVERED_OVER,
      modelId
    });

    expect(actualState.hoveredOverModel).toEqual(modelId);
  });

  it('should set the id of the selected operational point', () => {
    const featureProperties = {
      model: 'GFS'
    };

    const actualState = reducer(beforeState, {
      type: STORM_POINT_SELECTED,
      featureProperties
    });

    expect(actualState.selectedOperationalPoint).toEqual(featureProperties);
  });
});
