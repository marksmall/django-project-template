import MapboxDraw from '@mapbox/mapbox-gl-draw';

const PolygonMode = { ...MapboxDraw.modes.draw_polygon };

PolygonMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_polygon.onSetup.call(this, opts);
  props.polygon.properties = {
    ...props.polygon.properties,
    ...opts
  };
  console.log('PROPS: ', props);

  return {
    ...props
  };
};

export default PolygonMode;
