import { NotificationManager } from 'react-notifications';

import ReactGA from 'react-ga';

export const SET_VIEWPORT = 'SET_VIEWPORT';

export const MAP_STYLE_SELECTED = 'MAP_STYLE_SELECTED';

export const TOGGLE_MULTI_MODE = 'map.TOGGLE_MULTI_MODE';
export const TOGGLE_3D_MODE = 'map.TOGGLE_3D_MODE';

export const TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY =
  'map.TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY';
export const TOGGLE_CUSTOM_LAYER_VISIBILITY =
  'map.TOGGLE_CUSTOM_LAYER_VISIBILITY';

export const CUSTOM_DATA_REQUESTED_SUCCESS = 'CUSTOM_DATA_REQUESTED_SUCCESS';
export const CUSTOM_DATA_REQUESTED_FAILURE = 'CUSTOM_DATA_REQUESTED_FAILURE';

export const INFRASTRUCTURE_DATA_REQUESTED_SUCCESS =
  'INFRASTRUCTURE_DATA_REQUESTED_SUCCESS';
export const INFRASTRUCTURE_DATA_REQUESTED_FAILURE =
  'INFRASTRUCTURE_DATA_REQUESTED_FAILURE';

export const toggleMultiMode = () => async (dispatch, getState) => {
  ReactGA.event({
    category: 'Multi-Map',
    action: 'View',
    label: '' + !getState().map.isCompareMode
  });

  return dispatch({ type: TOGGLE_MULTI_MODE });
};
export const toggle3DMode = () => async (dispatch, getState) => {
  ReactGA.event({
    category: 'Toolbar',
    action: 'Toggle 3D',
    label: '' + !getState().map.is3D
  });

  return dispatch({ type: TOGGLE_3D_MODE });
};

export const fetchInfrastructureData = () => async dispatch => {
  // POST request model form to API.
  const response = await fetch(
    '/api/layers?key=data/processed/infrastructure',
    {
      credentials: 'include'
    }
  );
  const infrastructureData = await response.json();

  if (response.ok) {
    return dispatch({
      type: INFRASTRUCTURE_DATA_REQUESTED_SUCCESS,
      layers: infrastructureData
    });
  } else {
    const message = `${response.status} ${response.statusText} - ${infrastructureData.message}`;
    NotificationManager.error(
      message,
      'Fetching Infrastructure Data',
      50000,
      () => {}
    );
    return dispatch({
      type: INFRASTRUCTURE_DATA_REQUESTED_FAILURE,
      error: infrastructureData
    });
  }
};

export const fetchCustomData = () => async dispatch => {
  // POST request model form to API.
  const response = await fetch('/api/layers?key=data/processed/custom', {
    credentials: 'include'
  });
  const customData = await response.json();

  if (response.ok) {
    return dispatch({
      type: CUSTOM_DATA_REQUESTED_SUCCESS,
      layers: customData
    });
  } else {
    const message = `${response.status} ${response.statusText} - ${customData.message}`;
    NotificationManager.error(message, 'Fetching Custom Data', 50000, () => {});
    return dispatch({
      type: CUSTOM_DATA_REQUESTED_FAILURE,
      error: message
    });
  }
};

export const setViewport = viewport => ({ type: SET_VIEWPORT, viewport });
