import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';

const ImageMode = { ...MapboxDraw.modes.draw_point };

ImageMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_point.onSetup.call(this, opts);
  props.point.properties = {
    ...props.point.properties,
    ...opts
  };

  return {
    ...props
  };
};

ImageMode.onClick = ImageMode.onTap = function(state, event) {
  const {
    lngLat: { lng, lat }
  } = event;

  this.updateUIClasses({ mouse: Constants.cursors.MOVE });
  state.point.updateCoordinate('', lng, lat);
};

ImageMode.toDisplayFeatures = function(state, geojson, display) {
  console.log('DISPLAY: ', state, geojson);
  const isActivePoint = geojson.properties.id === state.point.id;
  geojson.properties.active = isActivePoint ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  if (!isActivePoint) return display(geojson);

  return display(geojson);
};

export default ImageMode;
