import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import useMapControl from './use-map-control.hook';

describe('useMapControl', () => {
  afterEach(cleanup);

  const mockMap = () => ({
    addControl: jest.fn(),
    removeControl: jest.fn()
  });

  it('instantiates the control if cond true', () => {
    const map = mockMap();
    const control = jest.fn();
    renderHook(() => useMapControl(map, true, control));
    expect(control.mock.instances).toHaveLength(1);
  });

  it("doesn't instantiate the control if cond false", () => {
    const map = mockMap();
    const control = jest.fn();
    renderHook(() => useMapControl(map, false, control));
    expect(control.mock.instances).toHaveLength(0);
  });

  it('instantiates the control with argurments', () => {
    const map = mockMap();
    const control = jest.fn();
    renderHook(() => useMapControl(map, true, control, 'bottom', 1, 'a'));
    expect(control.mock.instances).toHaveLength(1);
    expect(control).toHaveBeenCalledWith(1, 'a');
  });

  it('adds the control to the map', () => {
    const map = mockMap();
    const control = jest.fn();
    renderHook(() => useMapControl(map, true, control, 'bottom-left'));
    expect(map.addControl).toHaveBeenCalledWith(
      control.mock.instances[0],
      'bottom-left'
    );
  });

  it('removes the control from the map when condition changes', () => {
    const map = mockMap();
    const control = jest.fn();
    const { rerender } = renderHook(
      ({ condition }) => useMapControl(map, condition, control, 'bottom-left'),
      {
        initialProps: { condition: true }
      }
    );
    expect(map.removeControl).not.toHaveBeenCalled();
    rerender({ condition: false });
    expect(map.removeControl).toHaveBeenCalledWith(control.mock.instances[0]);
  });
});
