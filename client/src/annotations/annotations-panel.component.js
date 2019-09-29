import React, { useState } from 'react';

import useMap from '../map/use-map.hook';
import useMapControl from '../map/use-map-control.hook';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

import Button from '../ui/button.component';
import ColorPicker from './color-picker.component';
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

const AnnotationsPanel = ({ map }) => {
  const [mode, setMode] = useState('simple_select');
  const [isFillColour, setIsFillColour] = useState(false);

  const [colour, setColour] = useState({ hex: '#fff' });

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
        mapInstance.on('draw.selectionchange', event => {
          console.log('SELECTION CHANGE: ', event, drawCtrl.getMode());
        });
        // mapInstance.on('draw.modechange', event => {
        //   console.log('MODE CHANGE: ', event);
        // });
        if (mode !== 'trash' || mode === 'deleteAll') {
          // console.log('CHANGING MODE TO: ', mode);
          drawCtrl.changeMode(mode);
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
    [mode]
  );

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset}>
        <legend>Draw Shapes</legend>
        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => setMode('draw_line_string')}
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
          onClick={() => setMode('draw_polygon')}
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
          onClick={() => setMode('FreehandMode')}
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
          onClick={() => setMode('RotateMode')}
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
          onClick={() => setMode('RadiusMode')}
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
          onClick={() => setMode('trash')}
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
          onClick={() => setMode('deleteAll')}
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
        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => console.log('Change Font')}
          dataFor="font"
        >
          <FontIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="font">
          <span>Change Font</span>
        </ReactTooltip>

        <div>
          <Button
            className={styles.annotation}
            shape="round"
            onClick={() => setIsFillColour(!isFillColour)}
            dataFor="fillColour"
          >
            <span style={{ width: 20, height: 20, backgroundColor: colour.hex }}></span>
          </Button>
          <ReactTooltip id="fillColour">
            <span>Set Fill Colour</span>
          </ReactTooltip>

          {isFillColour && <ColorPicker colour={colour} setColour={c => setColour(c)} />}
        </div>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => console.log('Set Line Colour')}
          dataFor="lineColour"
        >
          <DeleteIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="lineColour">
          <span>Set Line Colour</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => console.log('Set Line Type')}
          dataFor="lineType"
        >
          <DeleteIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="lineType">
          <span>Set Line Type</span>
        </ReactTooltip>

        <Button
          className={styles.annotation}
          shape="round"
          onClick={() => console.log('Set Line Thickness')}
          dataFor="lineThickness"
        >
          <DeleteIcon className={styles.icon} />
        </Button>
        <ReactTooltip id="lineThickness">
          <span>Set Line Thickness</span>
        </ReactTooltip>
      </fieldset>
    </div>
  );
};

export default AnnotationsPanel;
