import React from 'react';
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

import { MemoryRouter } from 'react-router-dom';

import Admin from './admin.component';

describe('Admin Component', () => {
  afterEach(cleanup);

  it('should render links to admin areas', () => {
    const routes = [''];
    const { container, getByText } = render(
      <MemoryRouter initialEntries={routes}>
        <Admin />
      </MemoryRouter>
    );

    expect(getByText('Admin Users')).toBeInTheDocument();
    expect(getByText('Admin Others')).toBeInTheDocument();
    expect(container.querySelectorAll('a').length).toEqual(2);
  });

  xit('should navigate to `Admin Users` area on clicking link', async () => {
    const routes = ['/users'];
    const { getByText, debug, rerender } = render(
      <MemoryRouter initialEntries={routes}>
        <Admin />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Admin Users'));

    debug();
    rerender(
      <MemoryRouter initialEntries={routes}>
        <Admin />
      </MemoryRouter>
    );
    await waitForElement(() => getByText('Maintain Users'));
    debug();
  });

  xit('should navigate to `Admin Others` area on clicking link', async () => {});
});
