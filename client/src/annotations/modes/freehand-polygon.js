// Shortened version of https://github.com/bemky/mapbox-gl-draw-freehand-mode
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';

const FreehandPolygonMode = { ...MapboxDraw.modes.draw_polygon };

const drag = {
  enable(ctx) {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (!ctx.map || !ctx.map.dragPan || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('dragPan')) return;
      ctx.map.dragPan.enable();
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.dragPan) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.dragPan.disable();
    }, 0);
  }
};

FreehandPolygonMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_polygon.onSetup.call(this, opts);
  props.polygon.properties = {
    ...props.polygon.properties,
    ...opts,
    dragging: false
  };
  drag.disable(this);

  return {
    ...props
  };
};

FreehandPolygonMode.onDrag = function(state, event) {
  const { lngLat } = event;
  state.dragging = true;
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, lngLat.lng, lngLat.lat);
  state.currentVertexPosition++;
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, lngLat.lng, lngLat.lat);
};

FreehandPolygonMode.onMouseUp = function(state) {
  if (state.dragging) {
    this.map.fire(Constants.events.UPDATE, {
      action: Constants.updateActions.MOVE,
      features: this.getSelected().map(f => f.toGeoJSON())
    });
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
  }
};

export default FreehandPolygonMode;
