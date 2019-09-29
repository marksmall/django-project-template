import React, { useImperativeHandle, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import mapboxgl, { AttributionControl, NavigationControl, ScaleControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch, useSelector } from 'react-redux';
// import { useMapCrossFilter } from '../crossfilter';
import useMapbox from './use-mapbox.hook';
import useMap from './use-map.hook';
import useMapControl from './use-map-control.hook';
import layoutStyles from './map-layout.module.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
// import { setClickedFeature, MULTI_SELECT } from '../factsheet/factsheet.action';
import { useMapEvent, useMapLayerEvent } from './use-map-event.hook';
import { setViewport } from './map.actions';
import Annotations from '../annotations/annotations.component';
// import { formatKey } from '../utils/utils';
// import InfrastructureDetail from './infrastructure-details.component';
// import { selectedFeatureIds } from '../factsheet/factsheet.selector';
// import { CUSTOM_DATA_THRESHOLD } from '../constants';

// const interpolate = interpolation => (property, filter, values) => [
//   interpolation,
//   ['linear'],
//   ['get', property],
//   filter[0],
//   values[0],
//   filter[1],
//   values[1]
// ];

// const interpolateLinear = interpolate('interpolate');
// const interpolateHcl = interpolate('interpolate-hcl');
// const interpolateZoom = (min, max) => ['interpolate', ['linear'], ['zoom'], 6, min, 22, max];

const Map = (
  {
    selectedProperty,
    style = 'mapbox://styles/thermcert/cjxzywxui08131cry0du0zn4v',
    colorScheme,
    attribution = true,
    geocoder = true,
    navigation = true,
    scale = true,
    draw = true,
    layoutInvalidation,
    position
  },
  ref
) => {
  const accessToken = useSelector(state => state.app.config.mapbox_token);
  mapboxgl.accessToken = accessToken;

  // const { properties, filters, currentFilters, visible, setBounds } = useMapCrossFilter(selectedProperty);
  // const selectedPropertyMetadata = properties.find(property => property.field === selectedProperty);
  const { mapContainer, mapInstance } = useMapbox(style);
  // const [hoveredFeature, setHoveredFeature] = useState(null);

  // const selectedLsoaFeatureIds = useSelector(selectedFeatureIds);
  // const infrastructureLayers = useSelector(state => state.map.infrastructureLayers);

  // const customLayers = useSelector(state => state.map.customLayers);

  // const [selectedInfrastructureFeature, setSelectedInfrastructureFeature] = useState(null);
  // const [selectedCustomFeature, setSelectedCustomFeature] = useState(null);

  // const is3DMode = useSelector(state => state.map.is3DMode);

  // const popupRef = useRef(null);

  const dispatch = useDispatch();

  useMapControl(mapInstance, attribution, AttributionControl);
  useMapControl(mapInstance, navigation, NavigationControl, 'bottom-right');
  useMapControl(mapInstance, scale, ScaleControl);
  useMapControl(mapInstance, geocoder, MapboxGeocoder, 'top-left', {
    accessToken: accessToken,
    reverseGeocode: true,
    mapboxgl
  });
  // useMapControl(mapInstance, draw, MapboxDraw, 'top-right', {
  //   displayControlsDefault: false,
  //   controls: {
  //     line_string: true,
  //     polygon: true,
  //     trash: true
  //   }
  // });

  useMap(
    mapInstance,
    map => {
      const timer = setTimeout(() => {
        map.resize();
      }, 0);
      return () => clearTimeout(timer);
    },
    [layoutInvalidation]
  );

  useMapEvent(
    mapInstance,
    'move',
    () => {
      const viewport = {
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom()
      };
      dispatch(setViewport(viewport));
    },
    []
  );

  // useMap(
  //   mapInstance,
  //   map => {
  //     map.addSource('lsoas', {
  //       type: 'vector',
  //       url: 'mapbox://thermcert.lsoa_field_names'
  //     });
  //     map.addLayer(
  //       {
  //         id: 'lsoa-highlight',
  //         source: 'lsoas',
  //         'source-layer': 'lsoa_field_names',
  //         type: 'fill',
  //         paint: {
  //           'fill-outline-color': '#484496',
  //           'fill-color': [
  //             'case',
  //             ['boolean', ['feature-state', 'hovered'], false],
  //             'white',
  //             ['boolean', ['feature-state', 'selected'], false],
  //             'rgba(255, 255, 255, 0.3)',
  //             'rgba(0,0,0,0)'
  //           ],
  //           'fill-opacity': 0.3
  //         }
  //       },
  //       'tunnel-primary-secondary-tertiary-case'
  //     );
  //     map.addLayer(
  //       {
  //         id: 'lsoa',
  //         source: 'lsoas',
  //         'source-layer': 'lsoa_field_names',
  //         type: 'fill',
  //         paint: {
  //           'fill-outline-color': '#484496',
  //           'fill-color': 'rgba(0,0,0,0)',
  //           'fill-opacity': interpolateZoom(1, [
  //             'case',
  //             ['boolean', ['feature-state', 'selected'], false],
  //             0.5,
  //             0.3
  //           ])
  //         }
  //       },
  //       'lsoa-highlight'
  //     );

  //     map.addLayer(
  //       {
  //         id: 'lsoa-outline',
  //         source: 'lsoas',
  //         'source-layer': 'lsoa_field_names',
  //         type: 'line',
  //         layout: {
  //           'line-join': 'bevel'
  //         },
  //         paint: {
  //           'line-width': interpolateZoom(1.8, 3),
  //           'line-blur': 0.2,
  //           'line-color': [
  //             'case',
  //             ['boolean', ['feature-state', 'selected'], false],
  //             '#ea1c0a',
  //             'rgba(0, 0, 0, 0)'
  //           ]
  //         }
  //       },
  //       'road-label'
  //     );
  //   },
  //   []
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     map.easeTo({ pitch: is3DMode ? 45 : 0 });

  //     if (is3DMode) {
  //       map.setLayoutProperty('lsoa', 'visibility', 'none');
  //       if (currentFilters) {
  //         map.addLayer(
  //           {
  //             id: 'lsoa-extrusion',
  //             source: 'lsoas',
  //             'source-layer': 'lsoa_field_names',
  //             type: 'fill-extrusion',
  //             paint: {
  //               'fill-extrusion-color': [
  //                 'case',
  //                 ['boolean', ['feature-state', 'hovered'], false],
  //                 'rgba(255,255,255,1)',
  //                 'rgba(0,0,0,0)'
  //               ],
  //               'fill-extrusion-opacity': 1,
  //               'fill-extrusion-height': 0
  //             }
  //           },
  //           'road-label'
  //         );
  //       } else {
  //         if (map.getLayer('lsoa-extrusion')) {
  //           map.removeLayer('lsoa-extrusion');
  //         }
  //       }
  //     } else {
  //       if (map.getLayer('lsoa-extrusion')) {
  //         map.removeLayer('lsoa-extrusion');
  //       }
  //       map.setLayoutProperty('lsoa', 'visibility', 'visible');
  //       map.setLayoutProperty('lsoa-highlight', 'visibility', 'visible');
  //     }
  //   },
  //   [is3DMode, currentFilters]
  // );

  // useMapEvent(
  //   mapInstance,
  //   'move',
  //   () =>
  //     setBounds(
  //       mapInstance
  //         .getBounds()
  //         .toArray()
  //         .flat()
  //     ),
  //   [setBounds]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     if (!visible || selectedPropertyMetadata.type === 'raster') {
  //       map.setPaintProperty('lsoa', 'fill-color', 'rgba(0,0,0,0)');
  //     } else if (currentFilters && properties.length > 0) {
  //       if (is3DMode) {
  //         map.setPaintProperty('lsoa-extrusion', 'fill-extrusion-color', [
  //           'case',
  //           ['boolean', ['feature-state', 'hovered'], false],
  //           'rgba(0,0,0,0.6)',
  //           ['boolean', ['feature-state', 'selected'], false],
  //           '#dcdcdc',
  //           interpolateHcl(selectedProperty, currentFilters, colorScheme)
  //         ]);

  //         map.setPaintProperty('lsoa-extrusion', 'fill-extrusion-height', [
  //           'interpolate',
  //           ['exponential', 0.5],
  //           ['zoom'],
  //           0,
  //           interpolateLinear(selectedProperty, currentFilters, [0, 6371000]),
  //           22,
  //           interpolateLinear(selectedProperty, currentFilters, [0, 3])
  //         ]);
  //       } else {
  //         map.setPaintProperty('lsoa', 'fill-color', [
  //           'case',
  //           ['!', ['has', selectedProperty]],
  //           'rgba(0,0,0,0)',
  //           currentFilters[0] === currentFilters[1]
  //             ? 'rgba(0,0,0,0)'
  //             : interpolateHcl(selectedProperty, currentFilters, colorScheme)
  //         ]);
  //       }
  //     }
  //   },
  //   [
  //     visible,
  //     properties,
  //     selectedProperty,
  //     colorScheme,
  //     currentFilters,
  //     is3DMode,
  //     selectedPropertyMetadata
  //   ]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     const property = properties.find(
  //       property => property.field === selectedProperty
  //     );

  //     if (property && property.type === 'raster') {
  //       const sourceId = `${property.field}-source`;
  //       map.addSource(sourceId, {
  //         type: 'raster',
  //         url: property.url
  //       });

  //       map.addLayer(
  //         {
  //           id: property.field,
  //           type: 'raster',
  //           source: sourceId,
  //           layout: {
  //             visibility: property.visible ? 'visible' : 'none'
  //           },
  //           paint: {
  //             'raster-opacity': 0.8,
  //             'raster-resampling': 'nearest'
  //           }
  //         },
  //         'lsoa-highlight'
  //       );
  //     }

  //     return () => {
  //       const property = properties
  //         .filter(property => property.type === 'raster')
  //         .find(property => property.field === selectedProperty);
  //       if (property) {
  //         map.removeLayer(property.field);
  //         map.removeSource(`${property.field}-source`);
  //       }
  //     };
  //   },
  //   [properties, selectedProperty]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     const property = properties.find(
  //       property => property.field === selectedProperty
  //     );

  //     if (property && property.type !== 'raster') {
  //       const filter = ['all'].concat(
  //         Object.keys(filters).flatMap(propertyName => {
  //           const condition = [
  //             ['>=', ['get', propertyName], filters[propertyName][0]],
  //             ['<', ['get', propertyName], filters[propertyName][1]]
  //           ];
  //           if (selectedProperty === propertyName) {
  //             return condition;
  //           } else {
  //             return [
  //               ['any', ['!', ['has', propertyName]], ['all', ...condition]]
  //             ];
  //           }
  //         })
  //       );

  //       const layer = is3DMode ? 'lsoa-extrusion' : 'lsoa';

  //       if (filter.length > 1) {
  //         map.setFilter(layer, filter);
  //       } else {
  //         map.setFilter(layer, null);
  //       }
  //     }
  //   },
  //   [filters, properties, is3DMode, selectedProperty]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     if (hoveredFeature) {
  //       map.setFeatureState(
  //         {
  //           source: 'lsoas',
  //           id: hoveredFeature.id,
  //           sourceLayer: 'lsoa_field_names'
  //         },
  //         { hovered: true }
  //       );
  //     }

  //     return () => {
  //       if (hoveredFeature) {
  //         map.setFeatureState(
  //           {
  //             source: 'lsoas',
  //             id: hoveredFeature.id,
  //             sourceLayer: 'lsoa_field_names'
  //           },
  //           { hovered: false }
  //         );
  //       }
  //     };
  //   },
  //   [hoveredFeature, setHoveredFeature]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     selectedLsoaFeatureIds.forEach(featureId =>
  //       map.setFeatureState(
  //         {
  //           source: 'lsoas',
  //           id: featureId,
  //           sourceLayer: 'lsoa_field_names'
  //         },
  //         { selected: true }
  //       )
  //     );

  //     return () => {
  //       selectedLsoaFeatureIds.forEach(featureId => {
  //         map.setFeatureState(
  //           {
  //             source: 'lsoas',
  //             id: featureId,
  //             sourceLayer: 'lsoa_field_names'
  //           },
  //           { selected: false }
  //         );
  //       });
  //     };
  //   },
  //   [selectedLsoaFeatureIds]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     infrastructureLayers
  //       .filter(layer => layer.visible)
  //       .forEach(layer => {
  //         const sourceId = `${layer.id}-source`;
  //         map.addSource(sourceId, {
  //           type: 'geojson',
  //           data: layer.featureCollection,
  //           cluster: true,
  //           clusterMaxZoom: 14,
  //           clusterRadius: 50
  //         });

  //         // circle and symbol layers for rendering clustered and
  //         // non-clustered features.
  //         map.addLayer({
  //           id: `${layer.id}-circle`,
  //           type: 'circle',
  //           source: sourceId,
  //           paint: {
  //             'circle-color': ['case', ['has', 'point_count'], 'red', 'green'],
  //             'circle-opacity': 0.6,
  //             'circle-radius': 30
  //           },
  //           minzoom: 10,
  //           maxzoom: 19
  //         });
  //         map.addLayer({
  //           id: `${layer.id}-label`,
  //           source: sourceId,
  //           type: 'symbol',
  //           layout: {
  //             'icon-image': layer.icon,
  //             'icon-size': 0.5,
  //             'icon-allow-overlap': true,
  //             'text-field': '{point_count}',
  //             'text-offset': [0, 1.3]
  //           },
  //           minzoom: 10,
  //           maxzoom: 19
  //         });
  //       });

  //     return () => {
  //       infrastructureLayers
  //         .filter(layer => layer.visible)
  //         .forEach(layer => {
  //           map.removeLayer(`${layer.id}-circle`);
  //           map.removeLayer(`${layer.id}-label`);
  //           map.removeSource(`${layer.id}-source`);
  //         });
  //     };
  //   },
  //   [infrastructureLayers]
  // );

  // useMap(
  //   mapInstance,
  //   map => {
  //     customLayers
  //       .filter(layer => layer.visible)
  //       .forEach(layer => {
  //         const sourceId = `${layer.id}-source`;
  //         map.addSource(sourceId, {
  //           type: 'geojson',
  //           data: layer.featureCollection,
  //           cluster: true,
  //           clusterMaxZoom: 14,
  //           clusterRadius: 50
  //         });
  //         // circle and symbol layers for rendering clustered and
  //         // non-clustered features.
  //         map.addLayer({
  //           id: `${layer.id}-circle`,
  //           type: 'circle',
  //           source: sourceId,
  //           filter: ['has', 'point_count'],
  //           paint: {
  //             'circle-color': 'red',
  //             'circle-opacity': 0.6,
  //             'circle-radius': 30
  //           }
  //         });

  //         map.addLayer({
  //           id: `${layer.id}-label`,
  //           source: sourceId,
  //           type: 'symbol',
  //           layout: {
  //             'text-field': '{point_count}',
  //             'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
  //             'text-size': 25,
  //             'icon-image': [
  //               'case',
  //               [
  //                 '<=',
  //                 ['number', ['get', 'property_count']],
  //                 CUSTOM_DATA_THRESHOLD
  //               ],
  //               'blue-pin',
  //               'red-pin'
  //             ],
  //             'icon-size': ['case', ['has', 'point_count'], 0, 0.7],
  //             'icon-allow-overlap': true
  //           },
  //           paint: {
  //             'text-halo-width': 1.25,
  //             'text-halo-color': '#2b2b2b'
  //           }
  //         });
  //       });

  //     return () => {
  //       customLayers
  //         .filter(layer => layer.visible)
  //         .forEach(layer => {
  //           map.removeLayer(`${layer.id}-circle`);
  //           map.removeLayer(`${layer.id}-label`);
  //           map.removeSource(`${layer.id}-source`);
  //         });
  //     };
  //   },
  //   [customLayers]
  // );

  // const visibleInfrastructureLayers = infrastructureLayers
  //   .filter(layer => layer.visible)
  //   .map(layer => `${layer.id}-label`);

  // useMapLayerEvent(
  //   mapInstance,
  //   'click',
  //   visibleInfrastructureLayers,
  //   event => {
  //     event.preventDefault();

  //     const { features, lngLat } = event;

  //     if (features && features.length > 0) {
  //       if (features[0].properties.point_count) {
  //         mapInstance.flyTo({
  //           center: [lngLat.lng, lngLat.lat],
  //           zoom: mapInstance.getZoom() + 1
  //         });
  //       } else {
  //         if (!popupRef.current) {
  //           const infrastructureContainer = document.createElement('div');
  //           popupRef.current = infrastructureContainer;
  //         }
  //         // Only take the first feature, which should be the top most
  //         // feature and the one you meant.
  //         new mapboxgl.Popup()
  //           .setLngLat(features[0].geometry.coordinates.slice())
  //           .setDOMContent(popupRef.current)
  //           .on('close', () => setSelectedInfrastructureFeature(null))
  //           .addTo(mapInstance);

  //         setSelectedInfrastructureFeature(features[0]);
  //       }
  //     }
  //   },
  //   [infrastructureLayers, setSelectedInfrastructureFeature]
  // );

  // const visibleCustomLayers = customLayers
  //   .filter(layer => layer.visible)
  //   .map(layer => `${layer.id}-label`);

  // useMapLayerEvent(
  //   mapInstance,
  //   'click',
  //   visibleCustomLayers,
  //   event => {
  //     event.preventDefault();

  //     const { features, lngLat } = event;
  //     if (features && features.length > 0) {
  //       if (features[0].properties.point_count) {
  //         mapInstance.flyTo({
  //           center: [lngLat.lng, lngLat.lat],
  //           zoom: mapInstance.getZoom() + 1
  //         });
  //       } else {
  //         if (!popupRef.current) {
  //           popupRef.current = document.createElement('div');
  //         }
  //         // Only take the first feature, which should be the top most
  //         // feature and the one you meant.
  //         new mapboxgl.Popup()
  //           .setLngLat(features[0].geometry.coordinates.slice())
  //           .setDOMContent(popupRef.current)
  //           .on('close', () => setSelectedCustomFeature(null))
  //           .addTo(mapInstance);

  //         setSelectedCustomFeature(features[0]);
  //       }
  //     }
  //   },
  //   [visibleCustomLayers, setSelectedCustomFeature]
  // );

  // useMapLayerEvent(
  //   mapInstance,
  //   'mousemove',
  //   ['lsoa-highlight', 'lsoa-extrusion'],
  //   ({ features }) => {
  //     if (features && features.length > 0) {
  //       setHoveredFeature(features[0]);
  //     }
  //   },
  //   []
  // );

  // useMapLayerEvent(
  //   mapInstance,
  //   'click',
  //   ['lsoa-highlight', 'lsoa-extrusion'],
  //   event => {
  //     const { features, originalEvent } = event;

  //     if (features && features.length > 0 && !event._defaultPrevented) {
  //       if (originalEvent.ctrlKey || originalEvent.metaKey) {
  //         // Multiple feature select.
  //         dispatch(setClickedFeature(features[0], MULTI_SELECT));
  //       } else {
  //         dispatch(setClickedFeature(features[0]));
  //       }
  //     }
  //   },
  //   [dispatch]
  // );

  useImperativeHandle(ref, () => mapInstance);

  return (
    <div ref={mapContainer} className={layoutStyles.map} data-testid={`map-${position}`}>
      <Annotations map={mapInstance} />
      {/* {selectedInfrastructureFeature &&
        ReactDOM.createPortal(
          <div className={layoutStyles.popup}>
            <InfrastructureDetail feature={selectedInfrastructureFeature} />
          </div>,
          popupRef.current
        )} */}

      {/* {selectedCustomFeature &&
        ReactDOM.createPortal(
          <div className={layoutStyles.popup}>
            <ul className={layoutStyles.list}>
              {Object.keys(selectedCustomFeature.properties).map(key => (
                <li key={key}>
                  <span className={layoutStyles.label}>{formatKey(key)}:</span>
                  {selectedCustomFeature.properties[key]}
                </li>
              ))}
            </ul>
          </div>,
          popupRef.current
        )} */}
    </div>
  );
};

export default React.memo(React.forwardRef(Map));
