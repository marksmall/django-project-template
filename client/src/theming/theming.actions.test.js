import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SELECT_THEME, selectTheme } from './theming.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const THEMES = [
  {
    id: 'light',
    title: 'Light'
  },
  {
    id: 'dark',
    title: 'Dark'
  }
];

describe('Theme Actions', () => {
  let beforeState;

  beforeEach(() => {
    beforeState = {
      themes: THEMES,
      selectedTheme: THEMES[1]
    };
  });

  it('should dispatch the SELECT_THEME action with the selected Theme', () => {
    const theme = 'light';
    const expectedActions = [{ type: SELECT_THEME, theme }];

    const store = mockStore(beforeState);
    store.dispatch(selectTheme(theme));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
