import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';

import ThemeSelector from './theme-selector.component';

describe('Theme Selector Component', () => {
  beforeEach(cleanup);

  const THEMES = [
    {
      value: 'light',
      label: 'Light'
    },
    {
      value: 'dark',
      label: 'Dark'
    }
  ];

  it('should render with the `Light` Theme selected', () => {
    const handler = jest.fn();
    const { container, getByText } = render(
      <ThemeSelector themes={THEMES} selectedTheme={THEMES[0]} selectTheme={handler} />
    );

    expect(getByText('Application Theme:')).toBeInTheDocument();
    expect(container.querySelector('.select')).toBeInTheDocument();
    expect(getByText('Light')).toBeInTheDocument();
  });

  it('should render with the `Dark` Theme selected', () => {
    const handler = jest.fn();
    const { container, getByText } = render(
      <ThemeSelector themes={THEMES} selectedTheme={THEMES[1]} selectTheme={handler} />
    );

    expect(getByText('Application Theme:')).toBeInTheDocument();
    expect(container.querySelector('.select')).toBeInTheDocument();
    expect(getByText('Dark')).toBeInTheDocument();
  });

  xit('should switch from the `Light` to `Dark` Theme', () => {
    const handler = jest.fn();
    const { container, getByText, asFragment, debug } = render(
      <ThemeSelector themes={THEMES} selectedTheme={THEMES[0]} selectTheme={handler} />
    );
    debug();
    // expect(container.querySelector('StateManager')).toBeInTheDocument();
    // asFragment().debug();
    // console.log('FRAGMENT: ', asFragment());

    //   expect(testee.find('Select').prop('value')).toEqual(selectedTheme);
    // });
    // it('should call the selectTheme with the `Light` Theme selected', () => {
    //   testee = shallow(
    //     <ThemeSelector
    //       themes={THEMES}
    //       selectedTheme={selectedTheme}
    //       selectTheme={selectTheme}
    //     />
    //   );
    //   testee
    //     .find('StateManager')
    //     .simulate('change', { target: { value: 'light' } });
    //   expect(selectTheme).toHaveBeenCalled();
  });
});
