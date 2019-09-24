import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useMapbox = style => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const viewportConfig = useSelector(state => state.map.viewport);
  const viewport = useRef(viewportConfig);

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
