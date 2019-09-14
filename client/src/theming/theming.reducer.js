import { SELECT_THEME } from './theming.actions';

const themes = [
  {
    value: 'light',
    label: 'Light'
  },
  {
    value: 'dark',
    label: 'Dark'
  }
];

const initialState = {
  themes,
  selectedTheme: themes[1]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_THEME:
      return {
        ...state,
        selectedTheme: themes.find(theme => theme.value === action.theme)
      };

    default:
      return state;
  }
};

export default reducer;
