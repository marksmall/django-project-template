import reducer from './theming.reducer';
import { SELECT_THEME } from './theming.actions';

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

describe('Theme reducer', () => {
  let beforeState;

  beforeEach(() => {
    beforeState = {
      themes: THEMES,
      selectedTheme: THEMES[1]
    };
  });

  it('should return the initial state', () => {
    const actualState = reducer(undefined, {});

    expect(actualState).toEqual(expect.objectContaining(beforeState));
  });

  it('should set the selected Theme state', () => {
    const theme = 'light';
    const actualState = reducer(beforeState, {
      type: SELECT_THEME,
      theme
    });

    expect(actualState.selectedTheme).toEqual(THEMES[0]);
  });
});
