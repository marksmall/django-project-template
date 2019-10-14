import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

import RegisterForm from './register-form.component';

describe('Register Form Component', () => {
  let register = null;

  beforeEach(() => {
    register = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByLabelText } = render(
      <BrowserRouter>
        <RegisterForm register={register} />
      </BrowserRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Register New User');
    expect(getByLabelText('Username:')).toBeInTheDocument();
    expect(getByLabelText('Email Address:')).toBeInTheDocument();
    expect(getByLabelText('Password:')).toBeInTheDocument();
    expect(getByLabelText('Password (Confirm):')).toBeInTheDocument();
    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <RegisterForm register={register} />
      </BrowserRouter>
    );

    const username = getByLabelText('Username:');
    expect(username.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(username, { target: { value: 'testusername' } });
    expect(username.value).toEqual('testusername');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Register` button when form is valid', () => {
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <RegisterForm register={register} />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'password' } });

    expect(getByText('Register')).not.toHaveAttribute('disabled');
  });

  it('should not call register function when form is invalid and `Register` button clicked', () => {
    const { getByText } = render(
      <BrowserRouter>
        <RegisterForm register={register} />
      </BrowserRouter>
    );

    fireEvent.click(getByText('Register'));
    expect(register).not.toHaveBeenCalled();
  });

  it('should call register function when form is valid and `Register` button clicked', () => {
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <RegisterForm register={register} />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Password (Confirm):'), { target: { value: 'password' } });

    fireEvent.click(getByText('Register'));
    expect(register).toHaveBeenCalled();
  });
});
