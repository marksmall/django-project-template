import React, { useState } from 'react';

// import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

import Button from '../ui/button.component';
import { ReactComponent as AnnotationsIcon } from './annotations.svg';

// import useMapControl from '../map/use-map-control.hook';

import AnnotationsPanel from './annotations-panel.component';

// import RotateMode from 'mapbox-gl-draw-rotate-mode';
// import RadiusMode from './modes/radius';
// import LineMode from './modes/line';
// import PolygonMode from './modes/polygon';
// import FreehandPolygonMode from './modes/freehand-polygon';
// import CircleMode from './modes/circle';
// import LabelMode from './modes/label';
// import ImageMode from './modes/image';

import styles from './annotations.module.css';
// import drawStyles from './styles';

const Annotations = ({ map }) => {
  const [isOpen, setIsOpen] = useState(false);

  // TODO: Remove positioning of control once creating our own button hooks
  // into each control e.g. line_string, polygon etc.
  // useMapControl(map, true, MapboxDraw, 'top-left', {
  //   displayControlsDefault: false,
  //   userProperties: true,
  //   styles: drawStyles,
  //   modes: {
  //     ...MapboxDraw.modes,
  //     RotateMode,
  //     RadiusMode,
  //     LineMode,
  //     PolygonMode,
  //     FreehandPolygonMode,
  //     CircleMode,
  //     LabelMode,
  //     ImageMode
  //   }
  // });

  return (
    <div className={styles.annotations}>
      <Button shape="round" onClick={() => setIsOpen(!isOpen)}>
        <AnnotationsIcon className={styles.icon} />
      </Button>

      {isOpen && <AnnotationsPanel map={map} />}
    </div>
  );
};

export default Annotations;
