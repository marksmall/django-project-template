import { renderHook } from '@testing-library/react-hooks';
import { useMapEvent, useMapLayerEvent } from './use-map-event.hook';

describe('Map Event Hooks', () => {
  describe('useMapEvent Hook', () => {
    it('should call the map add event listener when added to the map', () => {
      const map = { on: jest.fn(), off: jest.fn() };
      let type = 'click';
      const cb = jest.fn();

      const { rerender } = renderHook(
        ({ map, type, cb }) => useMapEvent(map, type, cb, null),
        {
          initialProps: {
            map,
            type,
            cb
          }
        }
      );

      expect(map.on).toHaveBeenCalledWith(type, cb);
      expect(map.off).not.toHaveBeenCalled();

      rerender({ type: 'move' });

      expect(map.off).toHaveBeenCalledWith(type, cb);
    });
  });

  describe('useMapLayerEvent Hook', () => {
    it('should call the layer add event listener when added to the map', () => {
      const map = { on: jest.fn(), off: jest.fn() };
      const type = 'click';
      const layers = ['layer1', 'layer1'];
      const cb = jest.fn();

      const { rerender } = renderHook(
        ({ map, type, layers, cb }) =>
          useMapLayerEvent(map, type, layers, cb, null),
        {
          initialProps: {
            map,
            type,
            layers,
            cb
          }
        }
      );

      expect(map.on).toHaveBeenCalledWith(type, layers[0], cb);
      expect(map.off).not.toHaveBeenCalled();

      rerender({ type: 'move' });

      layers.forEach(layer =>
        expect(map.off).toHaveBeenCalledWith(type, layer, cb)
      );
    });
  });
});
