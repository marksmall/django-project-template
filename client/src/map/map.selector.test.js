import STORMS from '../data/storms.json';
import STORM from '../data/storm.json';
import SATELLITE_TIMESTAMPS from '../data/satellite-timestamps.json';

import { Modal } from '../acquisitions/acquisitions.actions';

import {
  getMapStyle,
  getModelNames,
  getStormsList,
  getOperationalPointsByModel,
  getStartEndDates,
  getSatellitePointsByTimestamp
} from './map.selector';

const models = ['NOGAPS', 'Canadian', 'CTCX', 'GFS', 'UKMet', 'HWRF'];

describe('Stormer Map selectors', () => {
  let beforeState;

  beforeEach(() => {
    beforeState = {
      stormer: {
        isLoading: false,
        storms: STORMS,
        currentStorm: STORM,
        selectedModel: null,
        selectedOperationalPoint: null,
        hoveredOverModel: null,
        hoveredOverNonOperationalStormTrack: null,
        mapHeight: '80vh',
        satelliteTimestamps: SATELLITE_TIMESTAMPS,
        error: null
      },
      timeSlider: {
        currentTimestamp: '2017-01-07T18:00:00Z',
        isSatelliteVisible: false,
        isTimeSliderVisible: true
      },
      legend: { windSpeedThreshold: 0 },
      acquisitions: {
        acquisitionMode: false,
        requestedAcquisitions: [],
        modal: Modal.NONE,
        highlightedAcquisitionId: null
      }
    };
  });

  it('should return a list of model names when getModelNames called', () => {
    const modelNames = getModelNames(beforeState);

    expect(modelNames).toBeDefined();
    expect(modelNames).toEqual(models);
  });

  it('should return a mapbox MapStyle object when getMapStyle called', () => {
    const mapStyle = getMapStyle(beforeState);
    expect(mapStyle.sources).toBeDefined();
    expect(mapStyle.layers).toBeDefined();
  });

  it('should return a list of storms when getStormsList called', () => {
    const expected = [
      { value: '2018-wp-5', label: 'WP05 2018' },
      { value: '2018-wp-4', label: 'WP04 2018' },
      { value: '2018-wp-3', label: 'WP03 2018' },
      { value: '2018-wp-2', label: 'WP02 2018' },
      { value: '2018-wp-1', label: 'WP01 2018' }
    ];

    const storms = getStormsList(beforeState);
    expect(storms).toBeDefined();
    expect(storms).toEqual(expected);
  });

  it('should return a filtered list of storm operational storm points when getOperationalPointsByModel called', () => {
    const points = getOperationalPointsByModel(beforeState);

    expect(points).toBeDefined();
    expect(Object.keys(points)).toEqual(models);
    expect(points.NOGAPS.color).toEqual('#ff7f0e');
    expect(points.GFS.color).toEqual('#9467bd');
  });

  it('should return a list of storm start/end dates when getStartEndDates called', () => {
    const dates = getStartEndDates(beforeState);

    const expected = ['2017-01-07T18:00:00Z', '2017-01-16T12:00:00Z'];

    expect(dates).toBeDefined();
    expect(dates).toEqual(expected);
  });

  it('should return a filtered list of satellite points when getSatellitePointsByTimestamp called', () => {
    const points = getSatellitePointsByTimestamp(beforeState);

    expect(points).toBeDefined();
    expect(points.color).toEqual('grey');
    expect(points.features.length).toEqual(0);
  });
});
