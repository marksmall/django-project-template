import MapboxDraw from '@mapbox/mapbox-gl-draw';

const LineMode = { ...MapboxDraw.modes.draw_line_string };

LineMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  props.line.properties = {
    ...props.line.properties,
    ...opts
  };

  return {
    ...props
  };
};

export default LineMode;
