import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';

const useMapbox = style => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const viewport = useRef({ zoom: 6, center: [-4.84, 54.71] });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      ...viewport.current,

      attributionControl: false
    });

    map.on('load', () => {
      setMapInstance(map);
      // used for cypress tests
      mapContainer.current.map = map;
    });

    return () => {
      viewport.current = {
        zoom: map.getZoom(),
        center: map.getCenter()
      };
      setMapInstance(null);
      window.requestIdleCallback(() => {
        map.remove();
      });
    };
  }, [style]);
  return { mapContainer, mapInstance };
};

export default useMapbox;
