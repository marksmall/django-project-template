import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import UserDetailForm from './user-detail-form.component';

describe('User Detail Form Component', () => {
  let createUser = null;

  beforeEach(() => {
    createUser = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByLabelText } = render(<UserDetailForm createUser={createUser} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByText('Create New User')).toBeInTheDocument();
    expect(getByLabelText('Username:')).toBeInTheDocument();
    expect(getByLabelText('Email Address:')).toBeInTheDocument();
    expect(getByLabelText('Password:')).toBeInTheDocument();

    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Create User')).toBeInTheDocument();
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByLabelText } = render(<UserDetailForm createUser={createUser} />);

    const username = getByLabelText('Username:');
    expect(username.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(username, { target: { value: 'testusername' } });
    expect(username.value).toEqual('testusername');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Create User` button when form is valid', () => {
    const { getByText, getByLabelText } = render(<UserDetailForm createUser={createUser} />);

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'testusername@test.com' } });

    expect(getByText('Create User')).not.toHaveAttribute('disabled');
  });

  it('should not call `createUser` function when form is invalid and `Create User` button clicked', () => {
    const { getByText } = render(<UserDetailForm createUser={createUser} />);

    fireEvent.click(getByText('Create User'));
    expect(createUser).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Update User` button clicked', () => {
    const { getByText, getByLabelText } = render(<UserDetailForm createUser={createUser} />);

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'testusername@test.com' } });

    fireEvent.click(getByText('Create User'));
    expect(createUser).toHaveBeenCalled();
  });
});
