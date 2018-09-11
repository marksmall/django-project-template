import React from 'react';
import PropTypes from 'prop-types';

import { toTwoDecimalPlaces } from '../utils/utils';

import style from './cursor-coords.module.css';

const CursorCoords = ({ lat, lng }) => (
  <span id="location" className={style.coords}>
    LAT: {toTwoDecimalPlaces(lat)}, LON: {toTwoDecimalPlaces(lng)}
  </span>
);

CursorCoords.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
};

export default CursorCoords;
