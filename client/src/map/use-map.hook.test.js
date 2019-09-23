import { renderHook } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import useMap from './use-map.hook';

describe('useMap Hook', () => {
  afterEach(cleanup);

  it('calls the callback passing in the map', () => {
    const map = {};
    const cb = jest.fn();
    renderHook(() => useMap(map, cb, []));
    expect(cb).toHaveBeenCalledWith(map);
  });

  it('calls the callback again when the deps change', () => {
    const map = {};
    const cb = jest.fn();
    const { rerender } = renderHook(({ dep }) => useMap(map, cb, [dep]), {
      initialProps: { dep: 1 }
    });
    expect(cb.mock.calls.length).toBe(1);
    rerender({ dep: 2 });
    expect(cb.mock.calls.length).toBe(2);
  });
  it('calls the callback again when the map changes', () => {
    let map = {};
    const cb = jest.fn();
    const { rerender } = renderHook(() => useMap(map, cb));
    expect(cb.mock.calls.length).toBe(1);
    map = {}; // diferent object
    rerender();
    expect(cb.mock.calls.length).toBe(2);
  });
});
