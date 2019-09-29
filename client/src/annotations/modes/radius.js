import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

const RadiusMode = { ...MapboxDraw.modes.draw_line_string };

RadiusMode.onSetup = function(opts) {
  const state = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  console.log('STATE: ', state);

  return state;
};

RadiusMode.toDisplayFeatures = function(state, geojson, display) {
  display(geojson);
};

export default RadiusMode;
