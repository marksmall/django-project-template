import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import length from '@turf/length';
import circleFn from '@turf/circle';

const CircleMode = { ...MapboxDraw.modes.draw_line_string };

CircleMode.onSetup = function(opts) {
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

  return {
    ...props,
    circle
  };
};

CircleMode.clickAnywhere = function(state, event) {
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

CircleMode.onMouseMove = function(state, event) {
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
};

CircleMode.onStop = function(state) {
  doubleClickZoom.enable(this);
  this.activateUIButton();

  // check to see if we've deleted this feature
  if (this.getFeature(state.line.id) === undefined) return;

  //remove last added coordinate
  state.line.removeCoordinate('0');
  if (state.line.isValid()) {
    this.deleteFeature([state.line.id], { silent: true });
    this.map.fire(Constants.events.CREATE, {
      features: [state.circle.toGeoJSON()]
    });
  } else {
    this.deleteFeature([state.line.id], { silent: true });
    this.deleteFeature([state.circle.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
  }
};

CircleMode.toDisplayFeatures = function(state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = isActiveLine ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  if (!isActiveLine) return display(geojson);

  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 2) return null;

  geojson.properties.meta = 'feature';

  // Display the line as it is drawn.
  display(geojson);
};

export default CircleMode;
