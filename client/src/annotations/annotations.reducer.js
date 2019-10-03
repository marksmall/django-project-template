import { SET_TEXT_LABEL_SELECTED } from './annotations.actions';

const initialState = {
  textLabelSelected: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEXT_LABEL_SELECTED:
      return { ...state, textLabelSelected: !state.textLabelSelected };

    default:
      return state;
  }
};

export default reducer;
