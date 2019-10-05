import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import length from '@turf/length';
import circleFn from '@turf/circle';

import { toDecimalPlaces } from '../../utils/numbers';

const RadiusMode = { ...MapboxDraw.modes.draw_line_string };

function getDisplayMeasurements(feature) {
  const lineLengthInMeters = length(feature, { units: 'kilometers' }) * 1000;

  let metricUnits = 'm';
  let metricMeasurement;
  metricMeasurement = lineLengthInMeters;
  if (lineLengthInMeters >= 1000) {
    // if over 1000 meters, upgrade metric
    metricMeasurement = lineLengthInMeters / 1000;
    metricUnits = 'km';
  }

  let standardUnits = 'feet';
  let imperialMeasurement;
  imperialMeasurement = lineLengthInMeters * 3.28084;
  if (imperialMeasurement >= 5280) {
    // if over 5280 feet, upgrade standard
    imperialMeasurement /= 5280;
    standardUnits = 'mi';
  }

  return {
    metric: `${toDecimalPlaces(metricMeasurement, 2)} ${metricUnits}`,
    standard: `${toDecimalPlaces(imperialMeasurement, 2)} ${standardUnits}`
  };
}

RadiusMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  props.line.properties = {
    ...props.line.properties,
    ...opts
  };

  const circle = this.newFeature({
    type: 'Feature',
    properties: {
      meta: 'feature',
      ...opts
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[0, 0]]
    }
  });
  this.addFeature(circle);

  const label = this.newFeature({
    type: 'Feature',
    properties: {
      meta: 'feature',
      ...opts
    },
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });
  this.addFeature(label);

  return {
    ...props,
    circle,
    label
  };
};

RadiusMode.clickAnywhere = function(state, event) {
  const {
    lngLat: { lng, lat }
  } = event;
  // this ends the drawing after the user creates a second point, triggering this.onStop
  if (state.currentVertexPosition === 1) {
    state.line.addCoordinate(0, lng, lat);
    return this.changeMode('simple_select', { featureIds: [state.line.id] });
  }
  this.updateUIClasses({ mouse: 'add' });
  state.line.updateCoordinate(state.currentVertexPosition, lng, lat);
  if (state.direction === 'forward') {
    state.currentVertexPosition += 1; // eslint-disable-line
    state.line.updateCoordinate(state.currentVertexPosition, lng, lat);
  } else {
    state.line.addCoordinate(0, lng, lat);
  }

  return null;
};

RadiusMode.onMouseMove = function(state, event) {
  MapboxDraw.modes.draw_line_string.onMouseMove.call(this, state, event);
  const geojson = state.line.toGeoJSON();
  const center = geojson.geometry.coordinates[0];
  const radius = length(geojson, { units: 'kilometers' });

  const options = {
    steps: 60,
    units: 'kilometers',
    properties: { parent: state.line.properties.id, ...state.circle.properties }
  };

  if (radius) {
    const circleFeature = circleFn(center, radius, options);
    state.circle.setCoordinates(circleFeature.geometry.coordinates);
  }

  const displayMeasurements = getDisplayMeasurements(geojson);
  state.label.setCoordinates(geojson.geometry.coordinates[0]);
  state.label.properties = {
    ...state.label.properties,
    radiusMetric: displayMeasurements.metric,
    radiusStandard: displayMeasurements.standard,
    parent: state.line.id
  };
};

RadiusMode.onStop = function(state) {
  doubleClickZoom.enable(this);
  this.activateUIButton();

  // check to see if we've deleted this feature
  if (this.getFeature(state.line.id) === undefined) return;

  //remove last added coordinate
  state.line.removeCoordinate('0');
  if (state.line.isValid()) {
    this.map.fire(Constants.events.CREATE, {
      features: [state.line.toGeoJSON(), state.circle.toGeoJSON(), state.label.toGeoJSON()]
    });
  } else {
    console.log('DELETEING');
    this.deleteFeature([state.line.id], { silent: true });
    this.deleteFeature([state.circle.id], { silent: true });
    this.deleteFeature([state.label.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
  }
};

RadiusMode.toDisplayFeatures = function(state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = isActiveLine ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  if (!isActiveLine) return display(geojson);

  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 2) return null;

  // Display the line as it is drawn.
  display(geojson);

  display(state.label.toGeoJSON());
};

export default RadiusMode;
