import React from 'react';
import { shallow } from 'enzyme';

import StormerMap from './map.component';

describe('Stormer Map Component', () => {
  it('renders without crashing', () => {
    const loading = false;
    const mapStyle = { sources: {}, layers: [] };
    const storms = [];
    const actualSourceId = 'actual-source';
    const operationalSourceId = 'operational-source';
    const nonOperationalSourceId = 'non-operational-source';
    const operationalPointsSourceId = 'operational-points-source';
    const acquisitionMode = false;
    const selectedOperationalPoint = null;
    const mapHeight = '80vh';

    const fetchStorms = jest.fn();
    const onStormSelection = jest.fn();
    const selectOperationalStormTrack = jest.fn();
    const hoveredOverOperationalStormTrack = jest.fn();
    const toggleAcquisitionMode = jest.fn();
    const addAcquisition = jest.fn();
    const highlightAcquisition = jest.fn();
    const resizeMap = jest.fn();

    const testee = shallow(
      <StormerMap
        loading={loading}
        mapStyle={mapStyle}
        storms={storms}
        actualSourceId={actualSourceId}
        operationalSourceId={operationalSourceId}
        nonOperationalSourceId={nonOperationalSourceId}
        operationalPointsSourceId={operationalPointsSourceId}
        acquisitionMode={acquisitionMode}
        selectedOperationalPoint={selectedOperationalPoint}
        mapHeight={mapHeight}
        fetchStorms={fetchStorms}
        onStormSelection={onStormSelection}
        selectOperationalStormTrack={selectOperationalStormTrack}
        hoveredOverOperationalStormTrack={hoveredOverOperationalStormTrack}
        toggleAcquisitionMode={toggleAcquisitionMode}
        addAcquisition={addAcquisition}
        highlightAcquisition={highlightAcquisition}
        resizeMap={resizeMap}
      />
    );

    expect(testee).toMatchSnapshot();
    expect(testee.find('ReactMapboxGl').length).toEqual(1);
  });
});
