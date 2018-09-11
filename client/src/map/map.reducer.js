import {
  SATELLITE_TIMESTAMPS_REQUESTED,
  SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS,
  SATELLITE_TIMESTAMPS_REQUESTED_FAILURE,
  STORMS_REQUESTED,
  STORMS_REQUESTED_SUCCESS,
  STORMS_REQUESTED_FAILURE,
  STORM_REQUESTED,
  STORM_REQUESTED_SUCCESS,
  STORM_REQUESTED_FAILURE,
  MODEL_SELECTED,
  STORM_POINT_SELECTED,
  MODEL_HOVERED_OVER
} from './map.actions';

const initialState = {
  isLoading: true,
  storms: null,
  currentStorm: null,
  currentStormName: null,
  selectedModel: null,
  selectedOperationalPoint: null,
  hoveredOverModel: null,
  hoveredOverNonOperationalStormTrack: null,
  satelliteTimestamps: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SATELLITE_TIMESTAMPS_REQUESTED:
      return state;
    case SATELLITE_TIMESTAMPS_REQUESTED_SUCCESS:
      return {
        ...state,
        satelliteTimestamps: action.timestamps,
        error: null
      };
    case SATELLITE_TIMESTAMPS_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case STORMS_REQUESTED:
      return state;
    case STORMS_REQUESTED_SUCCESS:
      const storm = action.storms[0];
      return {
        ...state,
        storms: action.storms,
        currentStormName: storm.name || storm.reference,
        error: null
      };
    case STORMS_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case STORM_REQUESTED:
      return { ...state, isLoading: true };
    case STORM_REQUESTED_SUCCESS:
      return {
        ...state,
        currentStorm: action.storm,
        currentStormName: action.name,
        isLoading: false,
        error: null
      };
    case STORM_REQUESTED_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    case MODEL_SELECTED:
      return { ...state, selectedModel: action.modelId };
    case MODEL_HOVERED_OVER:
      return { ...state, hoveredOverModel: action.modelId };

    case STORM_POINT_SELECTED:
      return { ...state, selectedOperationalPoint: action.featureProperties };

    default:
      return state;
  }
};

export default reducer;
