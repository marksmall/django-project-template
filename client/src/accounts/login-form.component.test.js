import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';

import { BrowserRouter } from 'react-router-dom';

import LoginForm from './login-form.component';

describe('Login Form Component', () => {
  let login = null;
  let user = null;
  let from = null;

  beforeEach(() => {
    login = jest.fn();
    user = null;
    from = {};
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Log In');
    expect(getByLabelText('Username:')).toBeInTheDocument();
    expect(getByLabelText('Email Address:')).toBeInTheDocument();
    expect(getByLabelText('Password:')).toBeInTheDocument();

    expect(getByText('Reset')).toBeInTheDocument();
    expect(container.querySelector('.submit')).toHaveTextContent('Login');
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    const username = getByLabelText('Username:');
    expect(username.value).toEqual('');
    expect(getByText('Reset')).toHaveAttribute('disabled');
    fireEvent.change(username, { target: { value: 'testusername' } });
    expect(username.value).toEqual('testusername');
    expect(getByText('Reset')).not.toHaveAttribute('disabled');
  });

  it('should enable `Login` button when form is valid', () => {
    const { container, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'testusername@test.com' } });

    expect(container.querySelector('.submit')).not.toHaveAttribute('disabled');
  });

  it('should not call `login` function when form is invalid and `Login` button clicked', () => {
    const { container } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    fireEvent.click(container.querySelector('.submit'));
    expect(login).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Update User` button clicked', () => {
    const { container, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'password' } });

    fireEvent.click(container.querySelector('.submit'));
    expect(login).toHaveBeenCalled();
  });
});
