import { NotificationManager } from 'react-notifications';
import { sendData, JSON_HEADERS } from '../utils/http';

export const LOGIN_REQUESTED_SUCCESS = 'LOGIN_REQUESTED_SUCCESS';
export const LOGIN_REQUESTED_FAILURE = 'LOGIN_REQUESTED_FAILURE';

export const REGISTER_REQUESTED_SUCCESS = 'REGISTER_REQUESTED_SUCCESS';
export const REGISTER_REQUESTED_FAILURE = 'REGISTER_REQUESTED_FAILURE';

export const LOGOUT_REQUESTED_SUCCESS = 'LOGOUT_REQUESTED_SUCCESS';
export const LOGOUT_REQUESTED_FAILURE = 'LOGOUT_REQUESTED_FAILURE';

export const FETCH_USER_REQUESTED_SUCCESS = 'FETCH_USER_REQUESTED_SUCCESS';
export const FETCH_USER_REQUESTED_FAILURE = 'FETCH_USER_REQUESTED_FAILURE';

export const UPDATE_USER_REQUESTED_SUCCESS = 'UPDATE_USER_REQUESTED_SUCCESS';
export const UPDATE_USER_REQUESTED_FAILURE = 'UPDATE_USER_REQUESTED_FAILURE';

const API_PREFIX = '/api/rest-auth/';
const API = {
  register: API_PREFIX + 'registration/',
  activate: API_PREFIX + 'registration/verify-email/',
  login: API_PREFIX + 'login/',
  changePassword: API_PREFIX + 'password/change/',
  resetPassword: API_PREFIX + 'password/reset/',
  confirmResetPassword: API_PREFIX + 'password/reset/confirm/',
  logout: API_PREFIX + 'logout/',
  user: '/api/users/'
};

/**
 * Call API with user details. If there is an problem with the
 * request, then dispatch an error action, otherwise, dispatch
 * a success action.
 *
 * @param {*} form
 */
export const register = form => async dispatch => {
  const response = await sendData(API.register, form, JSON_HEADERS);

  if (!response.ok) {
    // const errorResponse = await response.json();
    console.log('RESPONSE: ', JSON.stringify(response), response.statusText);
    const errorResponse = {};
    const error = new Error(errorResponseToString(errorResponse));
    console.log('ERROR: ', error);

    NotificationManager.error(error.message, `"Registration Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: REGISTER_REQUESTED_FAILURE,
      error
    });
  }

  NotificationManager.success(
    'Successfully registered, verification email has been sent',
    'Successful Registration',
    5000,
    () => {}
  );
  return dispatch({ type: REGISTER_REQUESTED_SUCCESS });
};

export const activateAccount = form => async () => {
  const response = await sendData(API.activate, form, JSON_HEADERS);

  if (!response.ok) {
    const errorResponse = await response.json();
    console.log('ERROR RESPONSE: ', errorResponse);
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(
      error.message,
      `Registration Verification Error - ${response.statusText}`,
      50000,
      () => {}
    );
  } else {
    NotificationManager.success('Successfully verified registration', 'Successful account activation', 5000, () => {});
  }
};

export const fetchUser = (username = 'current') => async dispatch => {
  console.log('FETCHING USER: ', username);
  const response = await fetch(`${API.user}${username}/`, { credentials: 'include' });

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;

    return dispatch({
      type: FETCH_USER_REQUESTED_FAILURE,
      error
    });
  }

  const user = await response.json();
  // console.log('USER: ', user);
  return dispatch({ type: FETCH_USER_REQUESTED_SUCCESS, user });
};

/**
 * Call API with user credentials and receive a user object in response.
 * If there is an problem with the request, then dispatch an error action,
 * otherwise, dispatch a success action.
 *
 * @param {*} form
 */
export const login = form => async dispatch => {
  const response = await sendData(API.login, form, JSON_HEADERS);

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(error.message, `Login Error - ${response.statusText}`, 50000, () => {});
    return dispatch({
      type: LOGIN_REQUESTED_FAILURE,
      error
    });
  }

  const userKey = await response.json();

  NotificationManager.success('Successfully logged in', 'Successful Login', 5000, () => {});

  // Now that we are logged in, retrieve the user's
  console.log('FETCH USER: ', form.username);
  dispatch(fetchUser(form.username));
  // console.log('USER FETCHED');

  return dispatch({ type: LOGIN_REQUESTED_SUCCESS, userKey });
};

/**
 *
 *
 * @param {*} history
 */
export const logout = history => async dispatch => {
  const response = await sendData(API.logout, {}, JSON_HEADERS);

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;
    alert('Error logging out');

    return dispatch({
      type: LOGOUT_REQUESTED_FAILURE,
      error
    });
  }

  dispatch({ type: LOGOUT_REQUESTED_SUCCESS });
  history.push('/logout');
};

export const changePassword = form => async (dispatch, getState) => {
  const {
    accounts: {
      userKey: { key }
    }
  } = getState();
  console.log('CHANGE PASSWORD: ', key, form);
  const headers = {
    ...JSON_HEADERS //,
    // authorization: "Token " + key
  };

  const response = await sendData(API.changePassword, form, headers);

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Change Password Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully changed password', 'Successful Password Change', 5000, () => {});
  }
};

export const resetPassword = form => async () => {
  const response = await sendData(API.resetPassword, form, JSON_HEADERS);

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Password Reset Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully Reset password', 'Successful Password Reset', 5000, () => {});
  }
};

export const confirmChangePassword = (form, params) => async () => {
  const { uid, token } = params;
  const data = {
    ...form,
    token,
    uid
  };

  const response = await sendData(API.confirmResetPassword, data, JSON_HEADERS);

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Password Reset Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully Reset password', 'Successful Password Reset', 5000, () => {});
  }
};

export const updateUser = form => async (dispatch, getState) => {
  const {
    account: { user }
  } = getState();
  const data = {
    ...user,
    ...form
  };
  const response = await sendData(API.user, data, JSON_HEADERS, 'PUT');

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Update User Error', 50000, () => {});

    return dispatch({
      type: UPDATE_USER_REQUESTED_FAILURE,
      error
    });
  }

  const userObj = await response.json();
  NotificationManager.success('Successfully updated user', 'Successful User Update', 5000, () => {});
  return dispatch({ type: UPDATE_USER_REQUESTED_SUCCESS, user: userObj });
};

const errorResponseToString = response => {
  // Reduce all field errors to a single string representation.
  const errorStr = Object.keys(response).reduce((acc, key) => {
    const fieldErrors = response[key];

    if (Array.isArray(fieldErrors)) {
      // Reduce array of field errors to a single string representation.
      const errors = fieldErrors.reduce((acc, error) => {
        return (acc += error + ' ');
      }, '');
      acc += `${key} - ${errors}\n`;
    } else if (typeof fieldErrors === 'string' || fieldErrors instanceof String) {
      acc += fieldErrors;
    }

    return acc;
  }, '');

  return errorStr;
};
