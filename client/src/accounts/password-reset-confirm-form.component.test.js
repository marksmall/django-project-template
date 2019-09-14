import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';

import PasswordResetConfirmForm from './password-reset-confirm-form.component';

describe('Password Reset Form Component', () => {
  let confirmChangePassword = null;
  let routerProps = null;

  beforeEach(() => {
    confirmChangePassword = jest.fn();
    routerProps = {
      match: {
        params: {}
      }
    };
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByLabelText } = render(
      <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Create New Password');
    expect(getByLabelText('New Password:')).toBeInTheDocument();
    expect(getByLabelText('Password (Confirm):')).toBeInTheDocument();
    expect(getByText('Reset')).toBeInTheDocument();
    expect(container.querySelector('.submit')).toHaveTextContent('Create Password');
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByLabelText } = render(
      <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
    );

    const password = getByLabelText('New Password:');
    expect(password.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Create Password` button when form is valid', () => {
    const { container, getByLabelText } = render(
      <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
    );

    fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'newpassword' } });

    expect(container.querySelector('.submit')).not.toHaveAttribute('disabled');
  });

  it('should not call `confirmChangePassword` function when form is invalid and `Update User` button clicked', () => {
    const { container } = render(
      <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
    );

    fireEvent.click(container.querySelector('.submit'));
    expect(confirmChangePassword).not.toHaveBeenCalled();
  });

  it('should call `confirmChangePassword` function when form is valid and `Update User` button clicked', () => {
    const { container, getByLabelText } = render(
      <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
    );

    fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'newpassword' } });

    fireEvent.click(container.querySelector('.submit'));
    expect(confirmChangePassword).toHaveBeenCalled();
  });
});
