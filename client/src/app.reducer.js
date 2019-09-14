import { FETCH_APP_CONFIG } from './app.actions';

const initialState = {
  config: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APP_CONFIG:
      return { ...state, config: action.config };

    default:
      return state;
  }
};

export default reducer;
