import {
  USERS_REQUESTED,
  USERS_REQUESTED_SUCCESS,
  USERS_REQUESTED_FAILURE,
  DELETE_USER_REQUESTED,
  DELETE_USER_REQUESTED_SUCCESS,
  DELETE_USER_REQUESTED_FAILURE,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_REQUESTED_SUCCESS,
  UPDATE_USER_REQUESTED_FAILURE,
  CREATE_USER_REQUESTED,
  CREATE_USER_REQUESTED_SUCCESS,
  CREATE_USER_REQUESTED_FAILURE
} from './users.actions';

const initialState = {
  users: null,
  isLoading: false,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_REQUESTED:
      return { ...state, isLoading: true };

    case USERS_REQUESTED_SUCCESS:
      return {
        ...state,
        users: action.users,
        isLoading: false,
        error: null
      };

    case USERS_REQUESTED_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    case DELETE_USER_REQUESTED:
      return { ...state, isLoading: true };

    case DELETE_USER_REQUESTED_SUCCESS:
      const users = state.users.filter(user => user.id !== action.id);

      return {
        ...state,
        users,
        isLoading: false,
        error: null
      };

    case DELETE_USER_REQUESTED_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    case UPDATE_USER_REQUESTED:
      return { ...state, isLoading: true };

    case UPDATE_USER_REQUESTED_SUCCESS:
      const updatedUsers = state.users.map(user => (user.id === action.user.id ? action.user : user));

      return {
        ...state,
        users: updatedUsers,
        isLoading: false,
        error: null
      };

    case UPDATE_USER_REQUESTED_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    case CREATE_USER_REQUESTED:
      return { ...state, isLoading: true };

    case CREATE_USER_REQUESTED_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.user],
        isLoading: false,
        error: null
      };

    case CREATE_USER_REQUESTED_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    default:
      return state;
  }
};

export default reducer;
