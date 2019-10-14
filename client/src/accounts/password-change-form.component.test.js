import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import PasswordChangeForm from './password-change-form.component';

describe('Password Reset Form Component', () => {
  let changePassword = null;

  beforeEach(() => {
    changePassword = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByLabelText } = render(<PasswordChangeForm changePassword={changePassword} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByText('Change Your Password')).toBeInTheDocument();
    expect(getByLabelText('Old Password:')).toBeInTheDocument();
    expect(getByLabelText('New Password:')).toBeInTheDocument();
    expect(getByLabelText('Password (Confirm):')).toBeInTheDocument();
    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Change Password')).toBeInTheDocument();
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByLabelText } = render(<PasswordChangeForm changePassword={changePassword} />);

    const password = getByLabelText('Old Password:');
    expect(password.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Change Password` button when form is valid', () => {
    const { getByText, getByLabelText } = render(<PasswordChangeForm changePassword={changePassword} />);

    fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'newpassword' } });

    expect(getByText('Change Password')).not.toHaveAttribute('disabled');
  });

  it('should not call `changePassword` function when form is invalid and `Update User` button clicked', () => {
    const { getByText } = render(<PasswordChangeForm changePassword={changePassword} />);

    fireEvent.click(getByText('Change Password'));
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('should call `changePassword` function when form is valid and `Update User` button clicked', () => {
    const { getByText, getByLabelText } = render(<PasswordChangeForm changePassword={changePassword} />);

    fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'newpassword' } });

    fireEvent.click(getByText('Change Password'));
    expect(changePassword).toHaveBeenCalled();
  });
});
