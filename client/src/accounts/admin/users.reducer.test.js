import reducer from './users.reducer';
import {
  USERS_REQUESTED,
  USERS_REQUESTED_SUCCESS,
  USERS_REQUESTED_FAILURE,
  DELETE_USER_REQUESTED,
  DELETE_USER_REQUESTED_SUCCESS,
  DELETE_USER_REQUESTED_FAILURE,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_REQUESTED_SUCCESS,
  UPDATE_USER_REQUESTED_FAILURE,
  CREATE_USER_REQUESTED,
  CREATE_USER_REQUESTED_SUCCESS,
  CREATE_USER_REQUESTED_FAILURE
} from './users.actions';

describe('Users reducer', () => {
  describe('Retrieve Users', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    it('should set the Loading state', () => {
      const actualState = reducer(beforeState, {
        type: USERS_REQUESTED
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users list in state', () => {
      const users = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      const actualState = reducer(beforeState, {
        type: USERS_REQUESTED_SUCCESS,
        users
      });

      expect(actualState.users).toEqual(users);
    });

    it('should set the error state, when failed to retrieve users', () => {
      const error = 'ERROR';
      const actualState = reducer(beforeState, {
        type: USERS_REQUESTED_FAILURE,
        error
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('Delete User', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should set the Loading state', () => {
      const actualState = reducer(beforeState, {
        type: DELETE_USER_REQUESTED
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it("should delete the specified user, by it's id", () => {
      const users = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      const expectedUsers = [
        {
          id: 2
        }
      ];
      beforeState.users = users;
      const id = 1;
      const actualState = reducer(beforeState, {
        type: DELETE_USER_REQUESTED_SUCCESS,
        id
      });

      expect(actualState.users).toEqual(expectedUsers);
    });

    it('should set the error state, when failed to retrieve users', () => {
      const error = 'ERROR';
      const actualState = reducer(beforeState, {
        type: DELETE_USER_REQUESTED_FAILURE,
        error
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('Update Users', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should set the Loading state', () => {
      const actualState = reducer(beforeState, {
        type: UPDATE_USER_REQUESTED
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the specified user', () => {
      const users = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      const expectedUsers = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      beforeState.users = users;
      const user = {
        ...users[0],
        id: 10
      };
      const actualState = reducer(beforeState, {
        type: UPDATE_USER_REQUESTED_SUCCESS,
        user
      });

      expect(actualState.users).toEqual(expectedUsers);
    });

    it('should set the error state, when failed to retrieve users', () => {
      const error = 'ERROR';
      const actualState = reducer(beforeState, {
        type: UPDATE_USER_REQUESTED_FAILURE,
        error
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('Create Users', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should set the Loading state', () => {
      const actualState = reducer(beforeState, {
        type: CREATE_USER_REQUESTED
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should create a new user', () => {
      const users = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      beforeState.users = users;
      const user = {
        id: 5
      };
      const actualState = reducer(beforeState, {
        type: CREATE_USER_REQUESTED_SUCCESS,
        user
      });

      expect(actualState.users).toEqual([...users, user]);
    });

    it('should set the error state, when failed to retrieve users', () => {
      const error = 'ERROR';
      const actualState = reducer(beforeState, {
        type: CREATE_USER_REQUESTED_FAILURE,
        error
      });

      expect(actualState.error).toEqual(error);
    });
  });
});
