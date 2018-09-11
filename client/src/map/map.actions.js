export const STORMS_REQUESTED = 'STORMS_REQUESTED';
export const STORMS_REQUESTED_SUCCESS = 'STORMS_REQUESTED_SUCCESS';
export const STORMS_REQUESTED_FAILURE = 'STORMS_REQUESTED_FAILURE';

export const STORM_REQUESTED = 'STORM_REQUESTED';
export const STORM_REQUESTED_SUCCESS = 'STORM_REQUESTED_SUCCESS';
export const STORM_REQUESTED_FAILURE = 'STORM_REQUESTED_FAILURE';

export const MODEL_SELECTED = 'MODEL_SELECTED';
export const STORM_POINT_SELECTED = 'STORM_POINT_SELECTED';
export const MODEL_HOVERED_OVER = 'MODEL_HOVERED_OVER';

export const SATELLITE_TIMESTAMPS_REQUESTED = 'SATELLITE_TIMESTAMPS_REQUESTED';
export const SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS = 'SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS';
export const SATELLITE_TIMESTAMPS_REQUESTED_FAILURE = 'SATELLITE_TIMESTAMPS_REQUESTED_FAILURE';

const SATELLITE_TIMESTAMPS = '/api/satellite-image/timestamps/';
const STORMS_API = '/api/storms/';
const QUERY_STRING = '?format=json';

/**
 * Fetch data from the server for an individual storm by it's id.
 * Also, set the current timestamp to the latest operational point received.
 *
 * @param {string} id storm unique identifier
 */
export const fetchStorm = (name, id) => async dispatch => {
  // Display load mask
  dispatch({ type: STORM_REQUESTED });

  try {
    return dispatch({ type: STORM_REQUESTED_SUCCESS, name });
  } catch (error) {
    console.error(error);
    dispatch({ type: STORM_REQUESTED_FAILURE, error });
  }
};

/**
 * Fetch the list of satellite timestamps we have satellite imagery
 * for.
 */
export const fetchSatelliteTimestamps = () => async dispatch => {
  // Request satellite timestamps from API.
  try {
    const response = await fetch(`${SATELLITE_TIMESTAMPS}${QUERY_STRING}`, {
      credentials: 'include'
    });
    const timestamps = await response.json();
    // const timestamps = SATELLITE_TIMESTAMPS;
    return dispatch({
      type: SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
      timestamps
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: SATELLITE_TIMESTAMPS_REQUESTED_FAILURE,
      error
    });
  }
};

/**
 * Fetch list of storms, setting the visible one to the latest in the list.
 */
export const fetchStorms = () => async dispatch => {
  // Get satellite timestamps.
  dispatch(fetchSatelliteTimestamps());

  // Display load mask
  dispatch({
    type: STORMS_REQUESTED
  });

  // Request storms from API.
  try {
    const response = await fetch(`${STORMS_API}${QUERY_STRING}`, {
      credentials: 'include'
    });
    const storms = await response.json();
    // const storms = STORMS;
    const latestStorm = storms[0];

    // Query API for data related to a single storm.
    dispatch(fetchStorm(latestStorm.name || latestStorm.reference, latestStorm.id));

    // Load storm data.
    return dispatch({
      type: STORMS_REQUESTED_SUCCESS,
      storms
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: STORMS_REQUESTED_FAILURE,
      error
    });
  }
};

/**
 * Fetch data for a single storm, by it's id.
 *
 * @param {string} stormId unique storm identifier.
 */
export const onStormSelection = (stormName, stormId) => fetchStorm(stormName, stormId);

/**
 * Select an operational model to view details for.
 *
 * @param {string} modelId unique model identifier.
 */
export const selectOperationalStormTrack = modelId => ({
  type: MODEL_SELECTED,
  modelId
});

/**
 * Select an operational model point.
 *
 * @param {object} featureProperties the features properties.
 */
export const selectOperationalStormPoint = featureProperties => ({
  type: STORM_POINT_SELECTED,
  featureProperties
});

/**
 * Hover over an operational model to view details for.
 *
 * @param {string} modelId unique model identifier.
 */
export const hoveredOverOperationalStormTrack = modelId => ({
  type: MODEL_HOVERED_OVER,
  modelId
});
