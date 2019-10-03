import React from 'react';

import { SketchPicker } from 'react-color';

const ColorPicker = ({ colour, setColour }) => <SketchPicker color={colour} onChangeComplete={c => setColour(c)} />;

export default ColorPicker;
