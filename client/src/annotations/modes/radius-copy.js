// Radius mode
// Source:
// https://gist.github.com/chriswhong/694779bc1f1e5d926e47bab7205fa559
// custom mapbopx-gl-draw mode that modifies draw_line_string
// shows a center point, radius line, and circle polygon while drawing
// forces draw.create on creation of second vertex
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable func-names */
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import lineDistance from '@turf/length';
import center from '@turf/center';

import { toDecimalPlaces } from '../../utils/numbers';

const RadiusMode = { ...MapboxDraw.modes.draw_line_string };

function createVertex(parentId, coordinates, path, selected) {
  return {
    type: 'Feature',
    properties: {
      meta: 'vertex',
      parent: parentId,
      coord_path: path,
      active: selected ? 'true' : 'false'
    },
    geometry: {
      type: 'Point',
      coordinates
    }
  };
}

// create a circle-like polygon given a center point and radius
// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js/39006388#39006388
function createGeoJSONCircle(center, radiusInKm, parentId, points = 64) {
  const coords = {
    latitude: center[1],
    longitude: center[0]
  };

  const km = radiusInKm;

  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  let theta;
  let x;
  let y;
  for (let i = 0; i < points; i += 1) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret]
    },
    properties: {
      parent: parentId
    }
  };
}

function getDisplayMeasurements(feature) {
  // should log both metric and standard display strings for the current drawn feature

  // metric calculation
  const drawnLength = lineDistance(feature) * 1000; // meters

  let metricUnits = 'm';
  let metricMeasurement;

  let standardUnits = 'feet';
  let standardMeasurement;

  metricMeasurement = drawnLength;
  if (drawnLength >= 1000) {
    // if over 1000 meters, upgrade metric
    metricMeasurement = drawnLength / 1000;
    metricUnits = 'km';
  }

  standardMeasurement = drawnLength * 3.28084;
  if (standardMeasurement >= 5280) {
    // if over 5280 feet, upgrade standard
    standardMeasurement /= 5280;
    standardUnits = 'mi';
  }

  const displayMeasurements = {
    metric: `${toDecimalPlaces(metricMeasurement, 2)} ${metricUnits}`,
    standard: `${toDecimalPlaces(standardMeasurement, 2)} ${standardUnits}`
  };

  return displayMeasurements;
}

const doubleClickZoom = {
  enable: ctx => {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue)
        return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  }
};

RadiusMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  props.properties = {
    ...props.properties,
    ...opts
  };
  const circle = this.newFeature({
    type: 'Feature',
    properties: {
      meta: 'radius',
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
      meta: 'currentPosition',
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
    label,
    ...opts
  };
};

RadiusMode.clickAnywhere = function(state, e) {
  // this ends the drawing after the user creates a second point, triggering this.onStop
  if (state.currentVertexPosition === 1) {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
    return this.changeMode('simple_select', { featureIds: [state.line.id] });
  }
  this.updateUIClasses({ mouse: 'add' });
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  if (state.direction === 'forward') {
    state.currentVertexPosition += 1; // eslint-disable-line
    state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  } else {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
  }

  return null;
};

RadiusMode.onMouseMove = function(state, e) {
  MapboxDraw.modes.draw_line_string.onMouseMove.call(this, state, e);
  const geojson = state.line.toGeoJSON();
  const centerCoord = geojson.geometry.coordinates[0];
  const radiusInKm = lineDistance(geojson, { units: 'kilometers' });
  const circleFeature = createGeoJSONCircle(centerCoord, radiusInKm, state.line.id);
  circleFeature.properties.meta = 'radius';
  state.circle.setCoordinates(circleFeature.geometry.coordinates);

  console.log('move state: ', state);
  const displayMeasurements = getDisplayMeasurements(geojson);
  state.label.properties = {
    ...state.label.properties,
    meta: 'Feature',
    radiusMetric: displayMeasurements.metric,
    radiusStandard: displayMeasurements.standard,
    parent: state.line.id
  };
  const lineCenter = center(geojson);
  state.label.setCoordinates(lineCenter.geometry.coordinates);
};

// creates the final geojson point feature with a radius property
// triggers draw.create
RadiusMode.onStop = function(state) {
  doubleClickZoom.enable(this);

  this.activateUIButton();

  // check to see if we've deleted this feature
  if (this.getFeature(state.line.id) === undefined) return;

  // remove last added coordinate
  state.line.removeCoordinate('0');
  if (state.line.isValid()) {
    // const geojson = state.line.toGeoJSON();
    // this.deleteFeature([state.line.id], { silent: true });

    this.map.fire('draw.create', {
      features: [state.circle.toGeoJSON(), state.line.toGeoJSON(), state.label.toGeoJSON()]
    });
  } else {
    console.log('DELETE FEATURES: ');
    this.deleteFeature([state.circle.id], { silent: true });
    this.deleteFeature([state.line.id], { silent: true });
    // this.deleteFeature([state.label.id], { silent: true });
    this.changeMode('simple_select', {}, { silent: true });
  }
};

RadiusMode.toDisplayFeatures = function(state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = isActiveLine ? 'true' : 'false';
  if (!isActiveLine) return display(geojson);

  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 2) return null;
  geojson.properties.meta = 'feature';

  // displays center vertex as a point feature
  display(
    createVertex(
      state.line.id,
      geojson.geometry.coordinates[state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1],
      `${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
      false
    )
  );

  // displays the line as it is drawn
  display(geojson);

  const displayMeasurements = getDisplayMeasurements(geojson);
  console.log('GEOJSON: ', geojson);
  const lineCenter = center(geojson);

  // create custom feature for the current pointer position
  state.label.properties = {
    ...state.label.properties,
    radiusMetric: displayMeasurements.metric,
    radiusStandard: displayMeasurements.standard
  };

  const currentVertex = {
    type: 'Feature',
    properties: {
      meta: 'currentPosition',
      radiusMetric: displayMeasurements.metric,
      radiusStandard: displayMeasurements.standard,
      parent: state.line.id
    },
    geometry: {
      type: 'Point',
      coordinates: lineCenter.geometry.coordinates
    }
  };
  // console.log('CURRENT VERTEX: ', currentVertex);
  display(currentVertex);
};

export default RadiusMode;

// import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

// import lengthFn from '@turf/length';
// import circleFn from '@turf/circle';

// const RadiusMode = { ...MapboxDraw.modes.draw_line_string };

// RadiusMode.onSetup = function(opts) {
//   const state = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
//   console.log('STATE: ', state);
//   const circle = this.newFeature({
//     type: 'Feature',
//     properties: {
//       meta: 'radius',
//       ...opts
//     },
//     geometry: {
//       type: 'Polygon',
//       coordinates: [[0, 0]]
//     }
//   });
//   this.addFeature(circle);

//   const label = this.newFeature({
//     type: 'Feature',
//     properties: {
//       meta: 'radius'
//     },
//     geometry: {
//       type: 'Point',
//       coordinates: []
//     }
//   });
//   this.addFeature(label);

//   return {
//     ...state,
//     circle,
//     label,
//     ...opts
//   };
// };

// RadiusMode.onSetup = function (opts) {
//   const state = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
// };
// // RadiusMode.clickAnywhere = function(state, e) {
// //   // this ends the drawing after the user creates a second point, triggering this.onStop
// //   if (state.currentVertexPosition === 1) {
// //     state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
// //     return this.changeMode('simple_select', { featureIds: [state.line.id] });
// //   }
// //   this.updateUIClasses({ mouse: 'add' });
// //   state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// //   if (state.direction === 'forward') {
// //     state.currentVertexPosition += 1; // eslint-disable-line
// //     state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// //   } else {
// //     state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
// //   }

// //   return null;
// // };

// RadiusMode.toDisplayFeatures = function(state, geojson, display) {
//   console.log('DISPLAY FEATURES: ', state, geojson);
//   const isActiveLine = geojson.properties.id === state.line.id;
//   geojson.properties.active = isActiveLine ? 'true' : 'false';
//   if (!isActiveLine) return display(geojson);

//   // Only render the line if it has at least one real coordinate
//   if (geojson.geometry.coordinates.length < 2) return null;
//   geojson.properties.meta = 'feature';
//   geojson.properties.fillColour = state.fillColour;

//   const line = state.line.toGeoJSON();
//   // console.log('RADIUS LINE: ', line);
//   const radius = lengthFn(line, { units: 'kilometers' });
//   // console.log('RADIUS LENGTH: ', radius);
//   const options = {
//     steps: 10,
//     units: 'kilometers',
//     properties: { meta: 'radius' }
//   };

//   // console.log('DISPLAYING: ', state, geojson);
//   display(geojson);

//   // if (line.geometry.coordinates.length === 2 && radius > 0) {
//   //   console.log('RADIUS CIRCLE: ', line.geometry.coordinates[0], radius, options);
//   //   const circle = circleFn(line.geometry.coordinates[0], radius, options);
//   //   console.log('RADIUS CIRCLE 2: ', circle);
//   //   display(circle);
//   // }

//   return null;
// };

// export default RadiusMode;
