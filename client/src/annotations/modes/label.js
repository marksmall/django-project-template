import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import length from '@turf/length';
import circleFn from '@turf/circle';

// import LabelForm from './text-dialog.component';

import styles from './label.module.css';

const LabelMode = { ...MapboxDraw.modes.draw_point };

LabelMode.onSetup = function(opts) {
  const props = MapboxDraw.modes.draw_point.onSetup.call(this, opts);
  props.point.properties = {
    ...props.point.properties,
    ...opts
  };

  return {
    ...props
  };
};

LabelMode.onClick = LabelMode.onTap = function(state, event) {
  const {
    lngLat: { lng, lat }
  } = event;

  this.updateUIClasses({ mouse: Constants.cursors.MOVE });
  state.point.updateCoordinate('', lng, lat);

  const div = document.createElement('div');
  div.innerText = 'Some text to hopefully make this element appear in the DOM';
  div.className = styles.label;
  const input = document.createElement('input');
  div.appendChild(input);
  const button = document.createElement('button');
  button.innerHTML = 'Add Label';
  button.onclick = event => {
    console.log('SAVE TEXT: ', event, input.value);
    state.point.properties.label = input.value;
    console.log('STATE POINT: ', state.point);
    this.map.fire(Constants.events.CREATE, {
      features: [state.point.toGeoJSON()]
    });
    // this.map.fire(Constants.events.UPDATE, {
    //   features: [state.point.toGeoJSON()]
    // });
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.point.id] });
  };
  div.appendChild(button);
  document.body.appendChild(div);
};

// LabelMode.clickAnywhere = function(state, event) {
//   const {
//     lngLat: { lng, lat }
//   } = event;
//   // this ends the drawing after the user creates a second point, triggering this.onStop
//   if (state.currentVertexPosition === 1) {
//     state.line.addCoordinate(0, lng, lat);
//     return this.changeMode('simple_select', { featureIds: [state.line.id] });
//   }
//   this.updateUIClasses({ mouse: 'add' });
//   state.line.updateCoordinate(state.currentVertexPosition, lng, lat);
//   if (state.direction === 'forward') {
//     state.currentVertexPosition += 1; // eslint-disable-line
//     state.line.updateCoordinate(state.currentVertexPosition, lng, lat);
//   } else {
//     state.line.addCoordinate(0, lng, lat);
//   }

//   return null;
// };

// LabelMode.onMouseMove = function(state, event) {
//   MapboxDraw.modes.draw_line_string.onMouseMove.call(this, state, event);
//   const geojson = state.line.toGeoJSON();
//   const center = geojson.geometry.coordinates[0];
//   const radius = length(geojson, { units: 'kilometers' });

//   const options = {
//     steps: 60,
//     units: 'kilometers',
//     properties: { parent: state.line.properties.id, ...state.circle.properties }
//   };

//   if (radius) {
//     const circleFeature = circleFn(center, radius, options);
//     state.circle.setCoordinates(circleFeature.geometry.coordinates);
//   }
// };

// LabelMode.onStop = function(state) {
//   doubleClickZoom.enable(this);
//   this.activateUIButton();

//   // check to see if we've deleted this feature
//   if (this.getFeature(state.line.id) === undefined) return;

//   //remove last added coordinate
//   state.line.removeCoordinate('0');
//   if (state.line.isValid()) {
//     this.deleteFeature([state.line.id], { silent: true });
//     this.map.fire(Constants.events.CREATE, {
//       features: [state.circle.toGeoJSON()]
//     });
//   } else {
//     this.deleteFeature([state.line.id], { silent: true });
//     this.deleteFeature([state.circle.id], { silent: true });
//     this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
//   }
// };

LabelMode.toDisplayFeatures = function(state, geojson, display) {
  console.log('DISPLAY: ', state, geojson);
  const isActiveLine = geojson.properties.id === state.point.id;
  geojson.properties.active = isActiveLine ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  if (!isActiveLine) return display(geojson);

  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 2) return null;

  // geojson.properties.meta = 'feature';
  console.log('DISPLAY: ', state, geojson);
  geojson.properties.label = 'hello';

  // Display the line as it is drawn.
  display(geojson);
};

export default LabelMode;
