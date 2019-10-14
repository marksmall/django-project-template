import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

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

  xit('should render a form', () => {
    const { container, getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Log In');
    expect(getByLabelText('Username:')).toBeInTheDocument();
    expect(getByLabelText('Password:')).toBeInTheDocument();

    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Login')).toHaveTextContent('Login');
  });

  xit('should enable `Reset` button when form is dirty', async () => {
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

  xit('should enable `Login` button when form is valid', () => {
    const { debug, getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );
    debug();

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'testusername@test.com' } });

    expect(getByText('Login')).toHaveAttribute('disabled', '');
  });

  xit('should not call `login` function when form is invalid and `Login` button clicked', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    fireEvent.click(getByText('Login'));
    expect(login).not.toHaveBeenCalled();
  });

  xit('should call `login` function when form is valid and `Update User` button clicked', () => {
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} from={from} />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText('Username:'), { target: { value: 'testusername' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'password' } });

    fireEvent.click(getByText('Login'));
    expect(login).toHaveBeenCalled();
  });
});
