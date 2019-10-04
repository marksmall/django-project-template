export default [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': ['get', 'user_fillColour'],
      // 'fill-color': 'blue',
      // 'fill-outline-color': 'yellow',
      'fill-outline-color': '#3bb2d0',
      'fill-opacity': ['get', 'user_fillOpacity']
      // 'fill-opacity': 0.1
    }
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#fbb03b',
      'fill-outline-color': '#fbb03b',
      'fill-opacity': ['get', 'user_fillOpacity']
      // 'fill-opacity': 0.1
    }
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': 'purple'
      // 'circle-color': '#fbb03b'
    }
  },
  {
    id: 'gl-draw-solid-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['==', 'user_lineTypeName', 'solid']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'user_lineColour'],
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-dashed-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['==', 'user_lineTypeName', 'dashed']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'user_lineColour'],
      'line-dasharray': [2, 2],
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-dotted-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['==', 'user_lineTypeName', 'dotted']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'user_lineColour'],
      'line-dasharray': [0.2, 2],
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': 'grey',
      // 'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      // 'line-width': 2
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-solid-line-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
      ['==', 'user_lineTypeName', 'solid']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'user_lineColour'],
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-dashed-line-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
      ['==', 'user_lineTypeName', 'dashed']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'user_lineColour'],
      'line-dasharray': [2, 2],
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-dotted-line-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
      ['==', 'user_lineTypeName', 'dotted']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'user_lineColour'],
      'line-dasharray': [0.2, 2],
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-line-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      // 'line-color': ['get', 'fillColour'],
      // 'line-color': 'green',
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      // 'line-width': 2
      'line-width': ['get', 'user_lineWidth']
    }
  },
  {
    id: 'gl-draw-line-label',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point'], ['has', 'radiusMetric']],
    // filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true'], ['==', 'meta', 'currentPosition']],
    layout: {
      'text-field': '{radiusMetric} \n {radiusStandard}',
      'text-anchor': 'left',
      'text-offset': [0, 0],
      'text-size': 16
    },
    paint: {
      'text-color': 'rgba(0, 0, 0, 1)',
      'text-halo-color': 'rgba(255, 255, 255, 1)',
      'text-halo-width': 3,
      // 'icon-opacity': {
      //   base: 1,
      //   stops: [[7.99, 1], [8, 0]]
      // },
      'text-halo-blur': 1
    }
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-inactive',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    id: 'gl-draw-point-stroke-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    paint: {
      'circle-radius': 7,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  },
  {
    id: 'gl-draw-point-stroke-active',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  },
  {
    id: 'gl-draw-point-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    paint: {
      'circle-radius': 5,
      'circle-color': 'green'
    }
  },
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
    paint: {
      'circle-radius': 5,
      'circle-color': 'blue'
    }
  },
  {
    id: 'gl-draw-polygon-fill-static',
    type: 'fill',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#404040',
      'fill-outline-color': '#404040',
      'fill-opacity': 0.1
    }
  },
  {
    id: 'gl-draw-polygon-stroke-static',
    type: 'line',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    id: 'gl-draw-line-static',
    type: 'line',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    id: 'gl-draw-point-static',
    type: 'circle',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#404040'
    }
  },
  {
    id: 'gl-draw-point-label',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point']],
    layout: {
      'text-field': '{label}',
      'text-anchor': 'left',
      'text-offset': [0, 0],
      'text-size': 16,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': 'rgba(0, 0, 0, 1)',
      'text-halo-color': 'rgba(255, 255, 255, 1)',
      'text-halo-width': 3,
      'text-halo-blur': 1
    }
  },
  {
    id: 'gl-draw-point-label-inactive',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point']],
    layout: {
      'text-field': '{label}',
      'text-anchor': 'left',
      'text-offset': [0, 0],
      'text-size': 16,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': 'rgba(0, 0, 0, 1)',
      'text-halo-color': 'rgba(255, 255, 255, 1)',
      'text-halo-width': 3,
      'text-halo-blur': 1
    }
  },
  {
    id: 'gl-draw-image',
    type: 'raster',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'mode', 'ImageMode']],
    paint: {
      'raster-opacity': 0.5
    }
  }
];
