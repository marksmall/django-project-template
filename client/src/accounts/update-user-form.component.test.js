import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';

import UpdateUserForm from './update-user-form.component';

describe('Update User Form Component', () => {
  afterEach(cleanup);

  it('should render a form', () => {
    const user = {};
    const updateUser = jest.fn();
    const { container, getByText, getByLabelText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Update User');
    expect(getByLabelText('Username:')).toBeInTheDocument();
    expect(getByLabelText('Email Address:')).toBeInTheDocument();
    expect(getByLabelText('First Name:')).toBeInTheDocument();
    expect(getByLabelText('Last Name:')).toBeInTheDocument();
    expect(getByText('Reset')).toBeInTheDocument();
    expect(container.querySelector('.submit')).toHaveTextContent('Update User');
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText, getByLabelText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    const firstName = getByLabelText('First Name:');
    expect(firstName.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(firstName, { target: { value: 'John' } });
    expect(firstName.value).toEqual('John');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Update User` button when form is valid', () => {
    const user = {};
    const updateUser = jest.fn();
    const { container, getByLabelText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'John' } });

    expect(container.querySelector('.submit')).not.toHaveAttribute('disabled');
  });

  it('should not call updateUser function when form is invalid and `Update User` button clicked', () => {
    const user = {};
    const updateUser = jest.fn();
    const { container } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.click(container.querySelector('.submit'));
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should call updateUser function when form is valid and `Update User` button clicked', () => {
    const user = {};
    const updateUser = jest.fn();
    const { container, getByLabelText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'John' } });
    fireEvent.click(container.querySelector('.submit'));
    expect(updateUser).toHaveBeenCalled();
  });
});
