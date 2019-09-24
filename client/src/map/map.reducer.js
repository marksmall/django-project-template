import {
  TOGGLE_3D_MODE,
  TOGGLE_MULTI_MODE,
  MAP_STYLE_SELECTED,
  TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY,
  TOGGLE_CUSTOM_LAYER_VISIBILITY,
  INFRASTRUCTURE_DATA_REQUESTED_SUCCESS,
  INFRASTRUCTURE_DATA_REQUESTED_FAILURE,
  CUSTOM_DATA_REQUESTED_SUCCESS,
  CUSTOM_DATA_REQUESTED_FAILURE,
  SET_VIEWPORT
} from './map.actions';

const MAP_STYLE_DATA = [
  {
    id: 'streets',
    uri: 'mapbox://styles/thermcert/cjyx8fn3u2ojo1cmzfl8spj05',
    title: 'Streets'
  },
  {
    id: 'light',
    uri: 'mapbox://styles/thermcert/cjyx8apt22o611cl5ih9kdrrh',
    title: 'Light'
  },
  {
    id: 'dark',
    uri: 'mapbox://styles/thermcert/cjyx8dj0m2om41cohblkd42my',
    title: 'Dark'
  },
  {
    id: 'satellite',
    uri: 'mapbox://styles/thermcert/cjyx826k90y3g1cmwp64ropem',
    title: 'Satellite'
  }
];

const initialState = {
  viewport: { zoom: 6, center: [-4.84, 54.71] },
  mapStyles: MAP_STYLE_DATA,
  selectedMapStyle: MAP_STYLE_DATA[3],
  isMultiMapMode: false,
  is3DMode: false,
  infrastructureLayers: [],
  customLayers: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEWPORT:
      return { ...state, viewport: action.viewport };

    case MAP_STYLE_SELECTED:
      return { ...state, selectedMapStyle: action.mapStyle };

    case TOGGLE_MULTI_MODE:
      return { ...state, isMultiMapMode: !state.isMultiMapMode };

    case TOGGLE_3D_MODE:
      return { ...state, is3DMode: !state.is3DMode };

    case TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY:
      // Toggle whether layer is visible or not.
      const infrastructureLayers = state.infrastructureLayers.map(layer => {
        if (layer.id === action.layer) {
          return {
            ...layer,
            visible: !layer.visible
          };
        } else {
          return layer;
        }
      });

      return {
        ...state,
        infrastructureLayers
      };

    case TOGGLE_CUSTOM_LAYER_VISIBILITY:
      // Toggle whether layer is visible or not.
      const customLayers = state.customLayers.map(layer =>
        layer.id === action.layer
          ? {
              ...layer,
              visible: !layer.visible
            }
          : layer
      );

      return {
        ...state,
        customLayers
      };

    case INFRASTRUCTURE_DATA_REQUESTED_SUCCESS:
      return { ...state, infrastructureLayers: action.layers };
    case INFRASTRUCTURE_DATA_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case CUSTOM_DATA_REQUESTED_SUCCESS:
      return { ...state, customLayers: action.layers };
    case CUSTOM_DATA_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default reducer;
