import {
  REGISTER_REQUESTED_SUCCESS,
  REGISTER_REQUESTED_FAILURE,
  LOGIN_REQUESTED_SUCCESS,
  LOGIN_REQUESTED_FAILURE,
  FETCH_USER_REQUESTED_SUCCESS,
  FETCH_USER_REQUESTED_FAILURE,
  UPDATE_USER_REQUESTED_SUCCESS,
  UPDATE_USER_REQUESTED_FAILURE,
  LOGOUT_REQUESTED_SUCCESS,
  LOGOUT_REQUESTED_FAILURE
} from './accounts.actions';

const initialState = {
  userKey: null,
  user: null,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUESTED_SUCCESS:
      return {
        ...state,
        error: null
      };
    case REGISTER_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case LOGIN_REQUESTED_SUCCESS:
      return {
        ...state,
        userKey: action.userKey,
        error: null
      };
    case LOGIN_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case FETCH_USER_REQUESTED_SUCCESS:
      return {
        ...state,
        user: action.user,
        error: null
      };
    case FETCH_USER_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case UPDATE_USER_REQUESTED_SUCCESS:
      return {
        ...state,
        user: action.user,
        error: null
      };
    case UPDATE_USER_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case LOGOUT_REQUESTED_SUCCESS:
      return {
        ...state,
        user: null,
        error: null
      };
    case LOGOUT_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default reducer;
