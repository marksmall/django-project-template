import React from 'react';
import { shallow } from 'enzyme';

import CursorCoords from './cursor-coords.component';

describe('CursorCoords Component', () => {
  it('renders without crashing', () => {
    const testee = shallow(<CursorCoords lat={0} lng={0} />);
    expect(testee).toBeDefined();
    expect(testee).toMatchSnapshot();
  });

  it('renders known lat/lon', () => {
    const value = 10;
    const text = `LAT: ${value}, LON: ${value}`;
    const testee = shallow(<CursorCoords lat={value} lng={value} />);

    expect(testee).toMatchSnapshot();
    expect(testee.text()).toEqual(text);
  });
});
