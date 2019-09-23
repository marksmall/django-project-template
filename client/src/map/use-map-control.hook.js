import useMap from './use-map.hook';

const useMapControl = (map, cond, control, position, ...args) => {
  useMap(
    map,
    map => {
      if (cond) {
        const ctrl = new control(...args);
        map.addControl(ctrl, position);
        return () => map.removeControl(ctrl);
      }
    },
    [cond]
  );
};

export default useMapControl;
