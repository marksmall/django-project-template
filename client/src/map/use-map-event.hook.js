import useMap from './use-map.hook';

export const useMapEvent = (mapInstance, type, fn, deps) => {
  useMap(
    mapInstance,
    map => {
      map.on(type, fn);

      return () => map.off(type, fn);
    },
    [deps]
  );
};

export const useMapLayerEvent = (mapInstance, type, layers, fn, deps) => {
  useMap(
    mapInstance,
    map => {
      layers.forEach(layer => {
        map.on(type, layer, fn);
      });

      return () => layers.forEach(layer => map.off(type, layer, fn));
    },
    [deps]
  );
};
