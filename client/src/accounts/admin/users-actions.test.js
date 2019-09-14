import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  CREATE_USER_REQUESTED,
  CREATE_USER_REQUESTED_SUCCESS,
  CREATE_USER_REQUESTED_FAILURE,
  createUser,
  USERS_REQUESTED,
  USERS_REQUESTED_SUCCESS,
  USERS_REQUESTED_FAILURE,
  fetchUsers,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_REQUESTED_SUCCESS,
  UPDATE_USER_REQUESTED_FAILURE,
  updateUser,
  DELETE_USER_REQUESTED,
  DELETE_USER_REQUESTED_SUCCESS,
  DELETE_USER_REQUESTED_FAILURE,
  deleteUser
} from './users.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Users Actions', () => {
  describe('Create User', () => {
    let beforeState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should dispatch the CREATE_USER_REQUESTED_FAILURE action if API not available', async () => {
      const error = new Error({ message: 'Error - Cannot find endpoint', status: 404, statusText: 'API Unavailable' });
      fetch.mockReject(error);
      const expectedActions = [{ type: CREATE_USER_REQUESTED }, { type: CREATE_USER_REQUESTED_FAILURE, error }];
      const store = mockStore(beforeState);
      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };
      await store.dispatch(createUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    // FIXME: Not sure how to test specific error types, customizing the error
    //        message isn't really proving anything. Leaving them while I
    //        discuss with others first.
    xit('should dispatch the CREATE_USER_REQUESTED_FAILURE action when missing username', async () => {
      const error = new Error({ message: 'Error - missing username', status: 400, statusText: 'Custom error' });
      fetch.mockReject(error);
      const expectedActions = [{ type: CREATE_USER_REQUESTED }, { type: CREATE_USER_REQUESTED_FAILURE, error }];
      const store = mockStore(beforeState);
      const form = {
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };
      await store.dispatch(createUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    xit('should dispatch the CREATE_USER_REQUESTED_FAILURE action when missing email', async () => {});

    xit('should dispatch the CREATE_USER_REQUESTED_FAILURE action when missing password1', async () => {});

    xit('should dispatch the CREATE_USER_REQUESTED_FAILURE action when missing password2', async () => {});

    xit("should dispatch the CREATE_USER_REQUESTED_FAILURE action when passwords don't match", async () => {});

    it('should dispatch the CREATE_USER_REQUESTED_SUCCESS action', async () => {
      const user = {};
      fetch.mockResponse(JSON.stringify(user, { status: 200 }));

      const expectedActions = [{ type: CREATE_USER_REQUESTED }, { type: CREATE_USER_REQUESTED_SUCCESS, user }];

      const store = mockStore(beforeState);
      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(createUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Retrieve User', () => {
    let beforeState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    xit('should dispatch the USERS_REQUESTED_FAILURE action if API not available', async () => {
      const error = new Error({ message: 'Error - Some error', status: 503, statusText: 'Custom error' });
      fetch.mockReject(error);

      const expectedActions = [{ type: USERS_REQUESTED }, { type: USERS_REQUESTED_FAILURE, error }];

      const store = mockStore(beforeState);

      await store.dispatch(fetchUsers());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the USERS_REQUESTED_SUCCESS action', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      fetch.mockResponse(JSON.stringify(users, { status: 200 }));

      const expectedActions = [{ type: USERS_REQUESTED }, { type: USERS_REQUESTED_SUCCESS, users }];

      const store = mockStore(beforeState);

      await store.dispatch(fetchUsers());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Update User', () => {
    let beforeState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should dispatch the UPDATE_USER_REQUESTED_FAILURE action if API not available', async () => {
      const error = new Error({ message: 'Error - Some error', status: 503, statusText: 'Custom error' });
      fetch.mockReject(error);

      const expectedActions = [{ type: UPDATE_USER_REQUESTED }, { type: UPDATE_USER_REQUESTED_FAILURE, error }];

      const store = mockStore(beforeState);

      const user = { id: 10 };
      await store.dispatch(updateUser(user));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the UPDATE_USER_REQUESTED_SUCCESS action', async () => {
      const user = { id: 10 };
      fetch.mockResponse(JSON.stringify(user, { status: 200 }));

      const expectedActions = [{ type: UPDATE_USER_REQUESTED }, { type: UPDATE_USER_REQUESTED_SUCCESS, user }];

      const store = mockStore(beforeState);

      await store.dispatch(updateUser(user));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Delete User', () => {
    let beforeState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should dispatch the DELETE_USER_REQUESTED_FAILURE action if API not available', async () => {
      const error = new Error({ message: 'Error - Some error', status: 503, statusText: 'Custom error' });
      fetch.mockReject(error);

      const expectedActions = [{ type: DELETE_USER_REQUESTED }, { type: DELETE_USER_REQUESTED_FAILURE, error }];

      const store = mockStore(beforeState);

      const user = { id: 10 };
      await store.dispatch(deleteUser(user));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the DELETE_USER_REQUESTED_SUCCESS action', async () => {
      const id = 1;
      fetch.mockResponse(JSON.stringify(id, { status: 200 }));

      const expectedActions = [{ type: DELETE_USER_REQUESTED }, { type: DELETE_USER_REQUESTED_SUCCESS, id }];

      const store = mockStore(beforeState);

      await store.dispatch(deleteUser(id));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
