import reducer from './map.reducer';
import {
  TOGGLE_3D_MODE,
  TOGGLE_MULTI_MODE,
  MAP_STYLE_SELECTED,
  TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY,
  TOGGLE_CUSTOM_LAYER_VISIBILITY,
  CUSTOM_DATA_REQUESTED_SUCCESS,
  CUSTOM_DATA_REQUESTED_FAILURE
} from './map.actions';

describe('Map reducer', () => {
  const initialState = reducer(undefined, { type: undefined });

  it('changes multimap mode on appropriate action', () => {
    expect(initialState.isMultiMapMode).toBe(false);
    expect(
      reducer(initialState, { type: TOGGLE_MULTI_MODE }).isMultiMapMode
    ).toBe(true);
  });

  it('changes 3d mode on appropriate action', () => {
    expect(initialState.is3DMode).toBe(false);
    expect(reducer(initialState, { type: TOGGLE_3D_MODE }).is3DMode).toBe(true);
  });

  it('should set the Map Style', () => {
    expect(
      reducer(initialState, {
        type: MAP_STYLE_SELECTED,
        mapStyle: { id: 'streets' }
      }).selectedMapStyle.id
    ).toEqual('streets');
  });

  it('should toggle the Infrastructure layer visibility', () => {
    const INFRASTRUCTURE = [
      {
        id: 'hospital-locations',
        title: 'Hospitals',
        featureCollection:
          '/api/proxy/s3?key=data/processed/infrastructure/thermcert_hospital_locations_uk.geojson',
        icon: 'hospital-sites',
        visible: false
      },
      {
        id: 'pharmacy-locations',
        title: 'Pharmacies',
        featureCollection:
          '/api/proxy/s3?key=data/processed/infrastructure/thermcert_pharmacy_locations_uk.geojson',
        icon: 'pharmacy-locations',
        visible: false
      }
    ];

    const infrastructureLayers = reducer(
      { infrastructureLayers: INFRASTRUCTURE },
      {
        type: TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY,
        layer: 'hospital-locations'
      }
    ).infrastructureLayers;
    const visibleInfrastructure = infrastructureLayers.filter(
      layer => layer.visible
    );

    expect(visibleInfrastructure[0]).toEqual({
      ...INFRASTRUCTURE[0],
      visible: true
    });
  });

  it('should toggle the Custom layer visibility', () => {
    const CUSTOM = [
      {
        id: 'hospital-locations',
        title: 'Hospitals',
        featureCollection:
          '/api/proxy/s3?key=data/processed/infrastructure/thermcert_hospital_locations_uk.geojson',
        icon: 'hospital-sites',
        visible: false
      },
      {
        id: 'pharmacy-locations',
        title: 'Pharmacies',
        featureCollection:
          '/api/proxy/s3?key=data/processed/infrastructure/thermcert_pharmacy_locations_uk.geojson',
        icon: 'pharmacy-locations',
        visible: false
      }
    ];

    const customLayers = reducer(
      { customLayers: CUSTOM },
      {
        type: TOGGLE_CUSTOM_LAYER_VISIBILITY,
        layer: 'hospital-locations'
      }
    ).customLayers;
    const visibleCustom = customLayers.filter(layer => layer.visible);

    expect(visibleCustom[0]).toEqual({
      ...CUSTOM[0],
      visible: true
    });
  });

  it('should set Custom data state on successful request', () => {
    const CUSTOM = [
      {
        id: 'hospital-locations',
        title: 'Hospitals',
        featureCollection:
          '/api/proxy/s3?key=data/processed/infrastructure/thermcert_hospital_locations_uk.geojson',
        icon: 'hospital-sites',
        visible: false
      },
      {
        id: 'pharmacy-locations',
        title: 'Pharmacies',
        featureCollection:
          '/api/proxy/s3?key=data/processed/infrastructure/thermcert_pharmacy_locations_uk.geojson',
        icon: 'pharmacy-locations',
        visible: false
      }
    ];

    expect(
      reducer(
        { customLayers: [] },
        {
          type: CUSTOM_DATA_REQUESTED_SUCCESS,
          layers: CUSTOM
        }
      ).customLayers
    ).toEqual(CUSTOM);
  });

  it('should set Custom data error state on failed request', () => {
    expect(
      reducer(
        { customLayers: [] },
        {
          type: CUSTOM_DATA_REQUESTED_FAILURE,
          error: 'Error Message'
        }
      ).error
    ).toEqual('Error Message');
  });
});
