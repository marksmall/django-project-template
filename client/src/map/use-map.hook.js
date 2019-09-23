import { useEffect as useEffect_ } from 'react';

const useMap = (map, callback, deps = []) =>
  useEffect_(() => {
    if (map) {
      return callback(map);
    }
  }, deps.concat([map]));

export default useMap;
