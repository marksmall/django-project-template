import React from 'react';

import { cleanup, render, fireEvent } from '@testing-library/react';

import Button from './button.component';
import { ReactComponent as CloseIcon } from './close.svg';

describe('Button Component', () => {
  afterEach(cleanup);

  it('should render a button tag with text under normal circumstances', () => {
    const { container, getByText } = render(<Button>Some Text</Button>);

    expect(container.querySelector('button')).toBeInTheDocument();
    expect(getByText('Some Text')).toBeInTheDocument();
  });

  it('should render an `a` tag if passed a `href` attribute', () => {
    const { container, getByText } = render(<Button href="foo">Some Text</Button>);

    expect(container.querySelector('a')).toBeInTheDocument();
    expect(getByText('Some Text')).toBeInTheDocument();
  });

  it('should have the correct class for styling', () => {
    const { getByText } = render(<Button>Some Text</Button>);

    expect(getByText('Some Text')).toHaveClass('button');
    expect(getByText('Some Text')).not.toHaveClass('disabled');
  });

  it('should propagates the click event properly', () => {
    const handler = jest.fn();
    const { getByText } = render(<Button onClick={handler}>Some Text</Button>);

    fireEvent.click(getByText('Some Text'));
    expect(handler).toHaveBeenCalled();
  });

  describe('disabled', () => {
    it('should disable the button', () => {
      const { getByText } = render(<Button disabled={true}>Some Text</Button>);

      expect(getByText('Some Text')).toHaveClass('disabled');
      expect(getByText('Some Text')).toHaveAttribute('disabled');
    });

    it('should not propagate the click event', () => {
      const handler = jest.fn();
      const { getByText } = render(
        <Button onClick={handler} disabled={true}>
          Some Text
        </Button>
      );

      fireEvent.click(getByText('Some Text'));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('active', () => {
    it('should add the active class for styling', () => {
      const { getByText } = render(<Button active={true}>Some Text</Button>);

      expect(getByText('Some Text')).toHaveClass('active');
    });
  });

  describe('shape', () => {
    it('should add the round class for styling, when shape attribute provided', () => {
      const { getByText } = render(
        <Button active={true} shape="round">
          Some Text
        </Button>
      );

      expect(getByText('Some Text')).toHaveClass('round');
    });
  });

  describe('icon', () => {
    it('should wrap an SVG, when provided', () => {
      const { getByText } = render(
        <Button>
          <CloseIcon alt="Close" />
        </Button>
      );

      expect(getByText('close.svg')).toBeInTheDocument();
    });
  });
});
