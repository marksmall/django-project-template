import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  TOGGLE_MULTI_MODE,
  toggleMultiMode,
  TOGGLE_3D_MODE,
  toggle3DMode,
  CUSTOM_DATA_REQUESTED_SUCCESS,
  CUSTOM_DATA_REQUESTED_FAILURE,
  fetchCustomData
} from './map.actions';

const mockStore = configureMockStore([thunk]);

describe('Map Actions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should dispatch toggle Multi-map mode.', () => {
    const expectedActions = [{ type: TOGGLE_MULTI_MODE }];
    const store = mockStore({
      map: {
        isCompareMode: false
      }
    });
    store.dispatch(toggleMultiMode());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch toggle 3D mode.', () => {
    const expectedActions = [{ type: TOGGLE_3D_MODE }];
    const store = mockStore({
      map: {
        is3D: false
      }
    });
    store.dispatch(toggle3DMode());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch SUCCESS action(s) to retrieve data from the API.', async () => {
    const layers = [{ id: 1 }, { id: 2 }];
    fetch.mockResponse(JSON.stringify(layers));
    const expectedActions = [{ type: CUSTOM_DATA_REQUESTED_SUCCESS, layers }];
    const store = mockStore({});
    await store.dispatch(fetchCustomData());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch FAILURE action(s) to retrieve data from the API.', async () => {
    fetch.mockResponse(
      JSON.stringify({
        message: 'Test error message'
      }),
      {
        ok: false,
        status: 401,
        statusText: 'Test Error'
      }
    );

    const expectedActions = [
      {
        type: CUSTOM_DATA_REQUESTED_FAILURE,
        error: '401 Test Error - Test error message'
      }
    ];
    const store = mockStore({});

    await store.dispatch(fetchCustomData());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
