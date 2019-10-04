import React, { useReducer, useRef } from 'react';
import ReactDOM from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';

import mapboxgl from 'mapbox-gl';
import useMap from '../map/use-map.hook';
import { useMapEvent } from '../map/use-map-event.hook';
import useMapControl from '../map/use-map-control.hook';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

// import Slider from 'rc-slider'
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

import Button from '../ui/button.component';
import ColorPicker from './color-picker.component';
import DropDownButton from './drop-down-button.component';
import ReactTooltip from 'react-tooltip';
import TextDialog from './text-dialog.component';
import LabelForm from './label-form.component';
import ImageForm from './image-form.component';

import { setTextLabelSelected } from './annotations.actions';

import drawStyles from './styles';

import { ReactComponent as LineStringIcon } from './linestring.svg';
import { ReactComponent as PolygonIcon } from './polygon.svg';
import { ReactComponent as DeleteIcon } from './delete.svg';
import { ReactComponent as FontIcon } from './font.svg';
import { ReactComponent as RotateIcon } from './rotate.svg';
import { ReactComponent as FreehandIcon } from './freehand.svg';
import { ReactComponent as RadiusIcon } from './radius.svg';
import { ReactComponent as LabelIcon } from './label.svg';
import { ReactComponent as ImageIcon } from './image.svg';

import lineWidth1PixelIcon from './1px-line-width.svg';
import lineWidth2PixelIcon from './2px-line-width.svg';
import lineWidth3PixelIcon from './3px-line-width.svg';

import lineTypeSolidIcon from './line-type-solid.svg';
import lineTypeDashedIcon from './line-type-dashed.svg';
import lineTypeDottedIcon from './line-type-dotted.svg';

import RotateMode from 'mapbox-gl-draw-rotate-mode';
import RadiusMode from './modes/radius';
import LineMode from './modes/line';
import PolygonMode from './modes/polygon';
import FreehandPolygonMode from './modes/freehand-polygon';
import CircleMode from './modes/circle';
import LabelMode from './modes/label';
import ImageMode from './modes/image';

import styles from './annotations-panel.module.css';

const primaryColor = '#5796e2';
const secondaryColor = '#e2e2e2';

const lineWidthOptions = [
  {
    id: 'lineWidth1',
    icon: lineWidth1PixelIcon,
    value: 1,
    tooltip: 'Set Line Width to 1px'
  },
  {
    id: 'lineWidth2',
    icon: lineWidth2PixelIcon,
    value: 5,
    tooltip: 'Set Line Width to 2px'
  },
  {
    id: 'lineWidth3',
    icon: lineWidth3PixelIcon,
    value: 10,
    tooltip: 'Set Line Width to 3px'
  }
];

const lineTypeOptions = [
  {
    id: 'solid',
    icon: lineTypeSolidIcon,
    value: false,
    tooltip: 'Set Line Type to Solid'
  },
  {
    id: 'dashed',
    icon: lineTypeDashedIcon,
    value: [2, 1],
    tooltip: 'Set Line Type to Dashed'
  },
  {
    id: 'dotted',
    icon: lineTypeDottedIcon,
    value: [1, 1],
    tooltip: 'Set Line Type to Dotted'
  }
];

const initialState = {
  lineColourSelected: false,
  lineColour: { hex: '#fff' },
  fillColourSelected: false,
  fillColour: { hex: '#fff' },
  mode: 'simple_select',
  lineWidthSelected: false,
  lineWidthOption: lineWidthOptions[0],
  lineTypeSelected: false,
  lineTypeOption: lineTypeOptions[0],
  fillOpacity: 0.5,
  textLabelSelected: false,
  addImageSelected: false,
  imageUrl: ''
};

const SET_FILL_COLOUR_SELECTED = 'SET_FILL_COLOUR_SELECTED';
const SET_FILL_COLOUR = 'SET_FILL_COLOUR';
const SET_FILL_OPACITY = 'SET_FILL_OPACITY';
const SET_LINE_COLOUR_SELECTED = 'SET_LINE_COLOUR_SELECTED';
const SET_LINE_COLOUR = 'SET_LINE_COLOUR';
const SET_DRAW_MODE = 'SET_DRAW_MODE';
const SET_LINE_WIDTH_SELECTED = 'SET_LINE_WIDTH_SELECTED';
const SET_LINE_WIDTH = 'SET_LINE_WIDTH';
const SET_LINE_TYPE_SELECTED = 'SET_LINE_TYPE_SELECTED';
const SET_LINE_TYPE = 'SET_LINE_TYPE';
const SET_TEXT_LABEL_SELECTED = 'SET_TEXT_LABEL_SELECTED';
const ADD_IMAGE_SELECTED = 'ADD_IMAGE_SELECTED';
const ADD_IMAGE = 'ADD_IMAGE';

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

    case SET_FILL_OPACITY:
      return { ...state, fillOpacity: action.opacity };

    case SET_DRAW_MODE:
      return { ...state, mode: action.mode };

    case SET_LINE_WIDTH_SELECTED:
      return { ...state, lineWidthSelected: !state.lineWidthSelected };
    case SET_LINE_WIDTH:
      return { ...state, lineWidthOption: action.option };

    case SET_LINE_TYPE_SELECTED:
      return { ...state, lineTypeSelected: !state.lineTypeSelected };
    case SET_LINE_TYPE:
      return { ...state, lineTypeOption: action.option };

    case SET_TEXT_LABEL_SELECTED:
      return { ...state, textLabelSelected: !state.textLabelSelected };

    case ADD_IMAGE_SELECTED:
      return { ...state, addImageSelected: !state.addImageSelected };
    case ADD_IMAGE:
      console.log('SET IMAGE URL: ', action.imageUrl);
      return { ...state, imageUrl: action.imageUrl };

    default:
      throw new Error('Unknown Action Type: ', action.type);
  }
};

const AnnotationsPanel = ({ map }) => {
  const globalDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    lineColourSelected,
    lineColour,
    fillColourSelected,
    fillColour,
    fillOpacity,
    mode,
    lineWidthSelected,
    lineWidthOption,
    lineTypeSelected,
    lineTypeOption,
    textLabelSelected,
    addImageSelected,
    imageUrl
  } = state;

  const drawOptions = {
    fillColour: fillColour.hex,
    lineColour: lineColour.hex,
    lineWidth: lineWidthOption.value,
    lineTypeName: lineTypeOption.id,
    lineType: lineTypeOption.value,
    fillOpacity,
    imageUrl
  };

  const popupRef = useRef(null);

  // TODO: Remove positioning of control once creating our own button hooks
  // into each control e.g. line_string, polygon etc.
  useMapControl(map, true, MapboxDraw, 'top-left', {
    displayControlsDefault: false,
    userProperties: true,
    styles: drawStyles,
    modes: {
      ...MapboxDraw.modes,
      RotateMode,
      RadiusMode,
      LineMode,
      PolygonMode,
      FreehandPolygonMode,
      CircleMode,
      LabelMode,
      ImageMode
    }
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
        //   console.log('CREATE EVENT: ', event, drawCtrl.getAll());
        // });
        // mapInstance.on('draw.render', event => {
        //   console.log('RENDER EVENT: ', event, drawCtrl.getAll());
        // });
        // mapInstance.on('draw.update', event => {
        //   console.log('UPDATE EVENT: ', event);
        // });
        // mapInstance.on('draw.modechange', event => {
        //   console.log('MODE CHANGE: ', event);
        // });
        if (mode !== 'trash' && mode !== 'deleteAll') {
          drawCtrl.changeMode(mode, drawOptions);
        } else {
          if (mode === 'deleteAll') {
            drawCtrl.deleteAll();
          } else {
            drawCtrl.trash();
          }
        }
      }
    },
    [mode, drawOptions]
  );

  useMapEvent(
    map,
    'click',
    event => {
      event.preventDefault();
      const { features, lngLat } = event;
      // console.log('FEATURES');

      // When user clicks map open Label Editor.
      if (!popupRef.current) {
        popupRef.current = document.createElement('div');
      }

      // Only take the first feature, which should be the top most
      // feature and the one you meant.
      if (textLabelSelected) {
        console.log('POPUP CONTENT: ', popupRef);
        new mapboxgl.Popup()
          // .setLngLat(features[0].geometry.coordinates.slice())
          .setLngLat(lngLat)
          .setDOMContent(popupRef.current)
          .on('close', () => console.log('Closing Popup'))
          .addTo(map);
      }
    },
    [textLabelSelected]
  );

  const addLabel = label => {
    console.log('Add Label: ', label);
  };

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset}>
        <legend>Draw Shapes</legend>
        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'LineMode' })}
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
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'PolygonMode' })}
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
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'FreehandPolygonMode' })}
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
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'CircleMode' })}
          dataFor="drawCircle"
        >
          <PolygonIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="drawCircle">
          <span>Draw Circle</span>
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

        <Button
          className={styles.annotation}
          shape="round"
          // onClick={() => dispatch({ type: SET_TEXT_LABEL_SELECTED })}
          // onClick={() => globalDispatch(setTextLabelSelected())}
          onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'LabelMode' })}
          dataFor="textLabel"
        >
          <LabelIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="textLabel">
          <span>Text Label</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: ADD_IMAGE_SELECTED })}
          dataFor="image"
        >
          <ImageIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="image">
          <span>Add Image</span>
        </ReactTooltip>
      </fieldset>

      {addImageSelected && (
        <ImageForm
          submit={imageUrl => {
            dispatch({ type: ADD_IMAGE, imageUrl });
            dispatch({ type: SET_DRAW_MODE, mode: 'ImageMode' });
          }}
        />
      )}

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
          <img className={styles.icon} src={lineTypeOption.icon} alt={lineTypeOption.tooltip} />
        </Button>
        <ReactTooltip id="lineType">
          <span>Set Line Type</span>
        </ReactTooltip>

        {lineTypeSelected && (
          <DropDownButton options={lineTypeOptions} select={option => dispatch({ type: SET_LINE_TYPE, option })} />
        )}

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => dispatch({ type: SET_LINE_WIDTH_SELECTED })}
          dataFor="lineWidth"
        >
          <img className={styles.icon} src={lineWidthOption.icon} alt={lineWidthOption.tooltip} />
        </Button>
        <ReactTooltip id="lineWidth">
          <span>Set Line Width</span>
        </ReactTooltip>

        {lineWidthSelected && (
          <DropDownButton options={lineWidthOptions} select={option => dispatch({ type: SET_LINE_WIDTH, option })} />
        )}

        <Slider
          dots
          step={0.1}
          min={0}
          max={1}
          defaultValue={0.5}
          // handle={handle}
          trackStyle={{ backgroundColor: primaryColor }}
          railStyle={{ backgroundColor: secondaryColor }}
          handleStyle={{
            backgroundColor: secondaryColor,
            borderColor: primaryColor
          }}
          dotStyle={{
            backgroundColor: secondaryColor,
            borderColor: secondaryColor
          }}
          activeDotStyle={{
            backgroundColor: primaryColor,
            borderColor: primaryColor
          }}
          onChange={opacity => dispatch({ type: SET_FILL_OPACITY, opacity })}
        />
      </fieldset>

      {/* {textLabelSelected &&
        popupRef.current &&
        ReactDOM.createPortal(
          <div className={styles.popup}>
            <LabelForm submit={addLabel} />
          </div>,
          popupRef.current
        )} */}
    </div>
  );
};

export default AnnotationsPanel;
