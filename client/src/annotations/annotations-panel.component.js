import React, { useState, useReducer } from 'react';

import useMap from '../map/use-map.hook';
import useMapControl from '../map/use-map-control.hook';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

import Button from '../ui/button.component';
import ColorPicker from './color-picker.component';
import LineWidthPicker from './line-width.component';
import ReactTooltip from 'react-tooltip';

import drawStyles from './styles';

import { ReactComponent as LineStringIcon } from './linestring.svg';
import { ReactComponent as PolygonIcon } from './polygon.svg';
import { ReactComponent as DeleteIcon } from './delete.svg';
import { ReactComponent as FontIcon } from './font.svg';
import { ReactComponent as RotateIcon } from './rotate.svg';
import { ReactComponent as FreehandIcon } from './freehand.svg';
import { ReactComponent as RadiusIcon } from './radius.svg';

import FreehandMode from 'mapbox-gl-draw-freehand-mode';
import RotateMode from 'mapbox-gl-draw-rotate-mode';
import RadiusMode from './modes/radius';

import styles from './annotations-panel.module.css';

const initialState = {
  lineColourSelected: false,
  lineColour: { hex: '#fff' },
  fillColourSelected: false,
  fillColour: { hex: '#fff' },
  mode: 'simple_select',
  lineWidthSelected: false,
  lineWidth: 1,
  lineTypeSelected: false,
  lineType: { hex: '#fff' }
};

const SET_FILL_COLOUR_SELECTED = 'SET_FILL_COLOUR_SELECTED';
const SET_FILL_COLOUR = 'SET_FILL_COLOUR';
const SET_LINE_COLOUR_SELECTED = 'SET_LINE_COLOUR_SELECTED';
const SET_LINE_COLOUR = 'SET_LINE_COLOUR';
const SET_DRAW_MODE = 'SET_DRAW_MODE';
const SET_LINE_WIDTH_SELECTED = 'SET_LINE_WIDTH_SELECTED';
const SET_LINE_WIDTH = 'SET_LINE_WIDTH';
const SET_LINE_TYPE_SELECTED = 'SET_LINE_TYPE_SELECTED';
const SET_LINE_TYPE = 'SET_LINE_TYPE';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LINE_COLOUR_SELECTED:
      return { ...state, lineColourSelected: !state.lineColourSelected };
    case SET_LINE_COLOUR:
      return { ...state, lineColour: action.colour };

    case SET_FILL_COLOUR_SELECTED:
      return { ...state, fillColourSelected: !state.fillColourSelected };
    case SET_FILL_COLOUR:
      return { ...state, fillColour: action.colour };

    case SET_DRAW_MODE:
      return { ...state, mode: action.mode };

    case SET_LINE_WIDTH_SELECTED:
      return { ...state, lineWidthSelected: !state.lineWidthSelected };
    case SET_LINE_WIDTH:
      return { ...state, lineWidth: action.width };

    case SET_LINE_TYPE_SELECTED:
      return { ...state, lineTypeSelected: !state.lineTypeSelected };
    case SET_LINE_TYPE:
      return { ...state, lineType: action.type };

    default:
      throw new Error('Unknown Action Type: ', action.type);
  }
};

const AnnotationsPanel = ({ map }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    lineColourSelected,
    lineColour,
    fillColourSelected,
    fillColour,
    mode,
    lineWidthSelected,
    lineWidth,
    lineTypeSelected,
    lineType
  } = state;

  const drawOptions = {
    fillColour: fillColour.hex,
    lineColour: lineColour.hex
  };

  // TODO: Remove positioning of control once creating our own button hooks
  // into each control e.g. line_string, polygon etc.
  useMapControl(map, true, MapboxDraw, 'top-left', {
    displayControlsDefault: false,
    userProperties: true,
    styles: drawStyles,
    modes: { ...MapboxDraw.modes, FreehandMode, RotateMode, RadiusMode }
  });

  useMap(
    map,
    mapInstance => {
      const drawCtrl = mapInstance._controls.find(ctrl => ctrl.changeMode);
      // console.log('DRAW CTRL STYLE: ', mode, drawCtrl);
      if (drawCtrl) {
        // mapInstance.on('draw.selectionchange', event => {
        //   console.log('SELECTION CHANGE: ', event, drawCtrl.getMode());
        // });
        // mapInstance.on('draw.create', event => {
        //   console.log('CREATE EVENT: ', event);
        // });
        // mapInstance.on('draw.modechange', event => {
        //   console.log('MODE CHANGE: ', event);
        // });
        if (mode !== 'trash' || mode === 'deleteAll') {
          // console.log('CHANGING MODE TO: ', mode);
          drawCtrl.changeMode(mode, drawOptions);
        } else {
          if (mode === 'deleteAll') {
            // drawCtrl.deleteAll();
          } else {
            // console.log('TRASHING: ', drawCtrl.getMode());
            // drawCtrl.changeMode('simple_select');
            // console.log('CURRENT MODE: ', drawCtrl.getMode());
            drawCtrl.trash();
          }
        }
      }
    },
    [mode, drawOptions]
  );

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset}>
        <legend>Draw Shapes</legend>
        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'draw_line_string' })}
          dataFor="drawLineString"
        >
          <LineStringIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="drawLineString">
          <span>Draw LineString</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'draw_polygon' })}
          dataFor="drawPolygon"
        >
          <PolygonIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="drawPolygon">
          <span>Draw Polygon</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'FreehandMode' })}
          dataFor="drawFreehandPolygon"
        >
          <FreehandIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="drawFreehandPolygon">
          <span>Draw Freehand Polygon</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'RotateMode' })}
          dataFor="rotate"
        >
          <RotateIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="rotate">
          <span>Rotate Shape</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'RadiusMode' })}
          dataFor="radius"
        >
          <RadiusIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="radius">
          <span>Radius Shape</span>
        </ReactTooltip>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Delete Shapes</legend>
        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'trash' })}
          dataFor="deleteAnnotations"
        >
          <DeleteIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="deleteAnnotations">
          <span>Delete Annotation</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'deleteAll' })}
          dataFor="deleteAllAnnotations"
        >
          <DeleteIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="deleteAllAnnotations">
          <span>Delete All Annotations</span>
        </ReactTooltip>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Configure Shapes</legend>
        <Button className={styles.annotation} shape="round" onClick={() => console.log('Change Font')} dataFor="font">
          <FontIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="font">
          <span>Change Font</span>
        </ReactTooltip>

        <div>
          <Button
            className={styles.annotation}
            shape="round"
            onClick={() => dispatch({ type: SET_FILL_COLOUR_SELECTED })}
            dataFor="fillColour"
          >
            <span style={{ width: 20, height: 20, backgroundColor: fillColour.hex }}></span>
          </Button>
          <ReactTooltip id="fillColour">
            <span>Set Fill Colour</span>
          </ReactTooltip>

          {fillColourSelected && (
            <ColorPicker colour={fillColour} setColour={colour => dispatch({ type: SET_FILL_COLOUR, colour })} />
          )}
        </div>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_LINE_COLOUR_SELECTED })}
          dataFor="lineColour"
        >
          <span style={{ width: 20, height: 20, backgroundColor: lineColour.hex }}></span>
        </Button>
        <ReactTooltip id="lineColour">
          <span>Set Line Colour</span>
        </ReactTooltip>

        {lineColourSelected && (
          <ColorPicker colour={lineColour} setColour={colour => dispatch({ type: SET_LINE_COLOUR, colour })} />
        )}

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_LINE_TYPE_SELECTED })}
          dataFor="lineType"
        >
          <DeleteIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="lineType">
          <span>Set Line Type</span>
        </ReactTooltip>

        {lineTypeSelected && <LineWidthPicker setLineType={lineType => dispatch({ type: SET_LINE_TYPE, lineType })} />}

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_LINE_WIDTH_SELECTED })}
          dataFor="lineWidth"
        >
          <span
            className={styles[`lineWidth${lineWidth}`]}
            style={{ width: 20, height: lineWidth, backgroundColor: '#000' }}
          ></span>
        </Button>
        <ReactTooltip id="lineWidth">
          <span>Set Line Width</span>
        </ReactTooltip>

        {lineWidthSelected && <LineWidthPicker setLineWidth={width => dispatch({ type: SET_LINE_WIDTH, width })} />}
      </fieldset>
    </div>
  );
};

export default AnnotationsPanel;
