import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import AccountActivationForm from './account-activation-form.component';

describe('Account Activation Form', () => {
  afterEach(cleanup);

  xit('should display a single Activate Account button', () => {
    // const { container, getByText } = render(<AccountActivationForm activateAccount={} props={} />);
    // expect(getByText('Activate Account')).toBeInTheDocument();
  });
});
