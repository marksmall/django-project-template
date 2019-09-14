import { NotificationManager } from 'react-notifications';
import { sendData, JSON_HEADERS } from '../../utils/http';

export const CREATE_USER_REQUESTED = 'CREATE_USER_REQUESTED';
export const CREATE_USER_REQUESTED_SUCCESS = 'CREATE_USER_REQUESTED_SUCCESS';
export const CREATE_USER_REQUESTED_FAILURE = 'CREATE_USER_REQUESTED_FAILURE';

export const USERS_REQUESTED = 'USERS_REQUESTED';
export const USERS_REQUESTED_SUCCESS = 'USERS_REQUESTED_SUCCESS';
export const USERS_REQUESTED_FAILURE = 'USERS_REQUESTED_FAILURE';

export const UPDATE_USER_REQUESTED = 'UPDATE_USER_REQUESTED';
export const UPDATE_USER_REQUESTED_SUCCESS = 'UPDATE_USER_REQUESTED_SUCCESS';
export const UPDATE_USER_REQUESTED_FAILURE = 'UPDATE_USER_REQUESTED_FAILURE';

export const DELETE_USER_REQUESTED = 'DELETE_USER_REQUESTED';
export const DELETE_USER_REQUESTED_SUCCESS = 'DELETE_USER_REQUESTED_SUCCESS';
export const DELETE_USER_REQUESTED_FAILURE = 'DELETE_USER_REQUESTED_FAILURE';

const API = '/api/users/';

/**
 * Call API with user details. If there is an problem with the
 * request, then dispatch an error action, otherwise, dispatch
 * a success action.
 *
 * @param {*} form
 */
export const createUser = fields => async dispatch => {
  dispatch({ type: CREATE_USER_REQUESTED });

  const response = await sendData(API, fields, JSON_HEADERS);

  if (!response.ok) {
    NotificationManager.error(response.statusText, 'Creating User', 5000, () => {});
    dispatch({ type: CREATE_USER_REQUESTED_FAILURE, error: response });
  } else {
    const user = await response.json();

    return dispatch({
      type: CREATE_USER_REQUESTED_SUCCESS,
      user
    });
  }
};

export const fetchUsers = () => async dispatch => {
  dispatch({ type: USERS_REQUESTED });

  const response = await fetch(API, {
    credentials: 'include'
  });

  if (!response.ok) {
    NotificationManager.error(response.statusText, 'Fetching Users', 5000, () => {});
    dispatch({ type: USERS_REQUESTED_FAILURE, error: response });
  } else {
    const users = await response.json();

    return dispatch({ type: USERS_REQUESTED_SUCCESS, users });
  }
};

export const updateUser = user => async dispatch => {
  dispatch({ type: UPDATE_USER_REQUESTED });

  const response = await sendData(`${API}${user.pk}/`, user, JSON_HEADERS, 'PUT');

  if (!response.ok) {
    NotificationManager.error(response.statusText, 'Updating User', 5000, () => {});
    return dispatch({ type: UPDATE_USER_REQUESTED_FAILURE, error: response });
  } else {
    const user = await response.json();

    return dispatch({ type: UPDATE_USER_REQUESTED_SUCCESS, user });
  }
};

export const deleteUser = id => async dispatch => {
  dispatch({ type: DELETE_USER_REQUESTED });

  const response = await sendData(API, id, null, 'DELETE');

  if (!response.ok) {
    NotificationManager.error(response.statusText, 'Deleting User', 5000, () => {});
    return dispatch({ type: DELETE_USER_REQUESTED_FAILURE, error: response });
  } else {
    return dispatch({ type: DELETE_USER_REQUESTED_SUCCESS, id });
  }
};

export const copyUser = user => async dispatch => {
  dispatch({ type: CREATE_USER_REQUESTED });

  // Update User to prepend 'Copy of' text.
  const data = {
    ...user,
    name: `Copy of ${user.name}`,
    description: `Copy of ${user.description}`
  };

  return dispatch(createUser(data));
};
