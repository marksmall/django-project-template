import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';
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
      meta: 'circle',
      ...opts
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[]]
    }
  });
  this.addFeature(circle);
  // console.log('CIRCLES: ', circleFeature, circleFeat.toGeoJSON());

  return {
    ...props,
    circle
  };
};

CircleMode.toDisplayFeatures = function(state, geojson, display) {
  console.log('DISPLAY FEATURES: ', state, geojson);
  // MapboxDraw.modes.draw_line_string.toDisplayFeatures.call(this, state, geojson, display);
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = isActiveLine ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  if (!isActiveLine) return;

  // display(geojson);
  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 3) return;

  const center = geojson.geometry.coordinates[0];
  const radius = length(geojson, { units: 'kilometers' });
  console.log('RADIUS: ', radius);

  const options = {
    steps: 60,
    units: 'kilometers',
    properties: { parent: state.line.properties.id, meta: 'circle', ...state.circle.properties }
  };

  const circleFeature = circleFn(center, radius, options);
  console.log('CIRCLE: ', circleFeature);
  display(circleFeature);
};

export default CircleMode;
