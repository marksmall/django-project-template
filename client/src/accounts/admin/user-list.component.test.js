import React from 'react';
import Provider from 'react-redux';
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

import UserList from './user-list.component';
import { createStore } from 'redux';

describe('User List Component', () => {
  let users = [];
  let fetchUsers = null;
  let deleteUser = null;
  let updateUser = null;
  let copyUser = null;

  beforeEach(() => {
    users = [];
    fetchUsers = jest.fn();
    deleteUser = jest.fn();
    updateUser = jest.fn();
    copyUser = jest.fn();
  });

  afterEach(cleanup);

  it('should render an empty list of users', () => {
    const { getByText } = render(
      <UserList
        users={users}
        fetchUsers={fetchUsers}
        deleteUser={deleteUser}
        updateUser={updateUser}
        copyUser={copyUser}
      />
    );

    expect(getByText('Maintain Users')).toBeInTheDocument();
    // expect(getByText('Admin Others')).not.toBeInTheDocument();
    expect(getByText('No Data Available')).toBeInTheDocument();
  });

  it('should render a populated list of users', () => {
    users = [
      {
        pk: 1,
        username: 'user 1',
        email: 'user1@test.com',
        first_name: 'John',
        last_name: 'Smith'
      },
      {
        pk: 2,
        username: 'user 2',
        email: 'user2@test.com',
        first_name: 'Jane',
        last_name: 'Doe'
      }
    ];
    const { getByText } = render(
      <UserList
        users={users}
        fetchUsers={fetchUsers}
        deleteUser={deleteUser}
        updateUser={updateUser}
        copyUser={copyUser}
      />
    );

    expect(getByText('Maintain Users')).toBeInTheDocument();
    expect(getByText('user1@test.com')).toBeInTheDocument();
    expect(getByText('user2@test.com')).toBeInTheDocument();
  });

  xit('should render the `New User` form when `New User` button clicked', async () => {
    const store = createStore(() => ({}), {});
    const { getByText, debug, rerender } = render(
      <Provider store={store}>
        <UserList
          users={users}
          fetchUsers={fetchUsers}
          deleteUser={deleteUser}
          updateUser={updateUser}
          copyUser={copyUser}
        />
      </Provider>
    );

    // await waitForElement(() => getByText('New User'));
    // fireEvent.click(getByText('New User'));
    debug();
  });
});
