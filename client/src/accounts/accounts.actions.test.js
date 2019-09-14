import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  REGISTER_REQUESTED_FAILURE,
  REGISTER_REQUESTED_SUCCESS,
  register,
  FETCH_USER_REQUESTED_FAILURE,
  FETCH_USER_REQUESTED_SUCCESS,
  LOGIN_REQUESTED_FAILURE,
  LOGIN_REQUESTED_SUCCESS,
  login
} from './accounts.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const THEMES = [
  {
    id: 'light',
    title: 'Light'
  },
  {
    id: 'dark',
    title: 'Dark'
  }
];

describe('Account Actions', () => {
  describe('Account Registration', () => {
    let beforeState;

    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    xit('should dispatch the REGISTER_REQUESTED_FAILURE action if API not available', async () => {
      const error = new Error({ message: 'Error - Fuck off', status: 503, statusText: 'WTF' });
      fetch.mockReject(error);

      const expectedActions = [{ type: REGISTER_REQUESTED_FAILURE, error }];

      const store = mockStore(beforeState);
      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    xit('should dispatch the REGISTER_REQUESTED_FAILURE action when missing username', async () => {
      fetch.mockResponse(JSON.stringify({ status: 400 }));
      const error = new Error();

      const expectedActions = [{ type: REGISTER_REQUESTED_FAILURE, error }];

      const store = mockStore(beforeState);
      const form = {
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the REGISTER_REQUESTED_FAILURE action when missing email', async () => {});

    it('should dispatch the REGISTER_REQUESTED_FAILURE action when missing password1', async () => {});

    it('should dispatch the REGISTER_REQUESTED_FAILURE action when missing password2', async () => {});

    it("should dispatch the REGISTER_REQUESTED_FAILURE action when passwords don't match", async () => {});

    it('should dispatch the REGISTER_REQUESTED_SUCCESS action', async () => {
      fetch.mockResponse(JSON.stringify({}));
      const expectedActions = [{ type: REGISTER_REQUESTED_SUCCESS }];

      const store = mockStore(beforeState);
      const form = {
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Account Activation', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    xit('should dispatch the SELECT_THEME action with the selected Theme', async () => {
      fetch.mockResponse(JSON.stringify({}));
      const expectedActions = [{ type: REGISTER_REQUESTED_SUCCESS }];

      const store = mockStore(beforeState);
      const form = {
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Account Login', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    xit('should dispatch the actions on successful login', async () => {
      const userKey = { key: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      const expectedActions = [
        { type: FETCH_USER_REQUESTED_SUCCESS, user },
        { type: LOGIN_REQUESTED_SUCCESS, userKey }
      ];

      const store = mockStore(beforeState);
      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password: 'password2'
      };

      await store.dispatch(login(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Account Logout', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    it('should dispatch the SELECT_THEME action with the selected Theme', async () => {});
  });

  describe('Change Account Password', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    it('should dispatch the SELECT_THEME action with the selected Theme', async () => {});
  });

  describe('Reset Account Password', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    it('should dispatch the SELECT_THEME action with the selected Theme', async () => {});
  });

  describe('Account Profile', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes: THEMES,
        selectedTheme: THEMES[1]
      };
    });

    it('should dispatch the SELECT_THEME action with the selected Theme', async () => {});
  });
});
