import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import { SketchPicker } from 'react-color';

const ColorPicker = ({ colour, setColour }) => <SketchPicker color={colour} onChangeComplete={c => setColour(c)} />;

// ColorPicker.propTypes = {

// }

export default ColorPicker;
