import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import PasswordResetForm from './password-reset-form.component';

describe('Password Reset Form Component', () => {
  let resetPassword = null;

  beforeEach(() => {
    resetPassword = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const resetPassword = jest.fn();
    const { container, getByText, getByLabelText } = render(<PasswordResetForm resetPassword={resetPassword} />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Reset Your Password');
    expect(getByLabelText('Email Address:')).toBeInTheDocument();
    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Reset Password')).toBeInTheDocument();
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByLabelText } = render(<PasswordResetForm resetPassword={resetPassword} />);

    const email = getByLabelText('Email Address:');
    expect(email.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(email, { target: { value: 'testusername@test.com' } });
    expect(email.value).toEqual('testusername@test.com');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const { getByText, getByLabelText } = render(<PasswordResetForm resetPassword={resetPassword} />);

    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });

    expect(getByText('Reset Password')).not.toHaveAttribute('disabled');
  });

  it('should not call updateUser function when form is invalid and `Update User` button clicked', () => {
    const { getByText } = render(<PasswordResetForm resetPassword={resetPassword} />);

    fireEvent.click(getByText('Reset Password'));
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('should call updateUser function when form is valid and `Update User` button clicked', () => {
    const { getByText, getByLabelText } = render(<PasswordResetForm resetPassword={resetPassword} />);

    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });

    fireEvent.click(getByText('Reset Password'));
    expect(resetPassword).toHaveBeenCalled();
  });
});
