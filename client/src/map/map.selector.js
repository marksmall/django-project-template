import { createSelector } from 'reselect';

import { lineString, coordAll, featureCollection, circle } from '@turf/turf';

import moment from 'moment';

import { interpolateBlues } from 'd3-scale-chromatic';

import { adminBoundaries } from '../utils/mapbox';

import { ensembleColorScale, tPlus48Color } from '../config';

import { isDayTime } from '../utils/time';

import {
  infrastructureSources,
  mapStyle,
  createVectorSource,
  createLineLayer,
  createSymbolLayer,
  createCircleLayer,
  createFillLayer,
  createSatelliteRasterSource,
  createSatelliteRasterLayer
} from '../utils/mapbox';

import {
  actualSourceId,
  operationalSourceId,
  operationalPointsSourceId,
  nonOperationalSourceId
} from './map.constants';

import { getAcquisitions } from '../acquisitions/acquisitions.selector';

import { getWindThreshold } from '../legend/legend.selector';

import {
  getCurrentTimestamp,
  isSatelliteVisible
} from '../time-slider/time-slider.selector';

const satelliteCoverageSourceId = 'satellite-coverage';
const nonOperationalWindRadiiSourceId = 'non-operational-wind-radii-points';
const nonOperationalForecastPointsSourceId = 'non-operational-forecast-points';

const getCurrentStorm = state => state.stormer.currentStorm;

export const getModelNames = createSelector(getCurrentStorm, storm => {
  if (storm) {
    const pointFeaturesByModel = getPointFeaturesByModel(
      storm.operationalStormTrackPoints.features
    );
    return Object.keys(pointFeaturesByModel);
  }
});

export const getCurrentStormName = state => state.stormer.currentStormName;

export const getSelectedModel = state => state.stormer.selectedModel;
export const getSelectedOperationalPoint = state =>
  state.stormer.selectedOperationalPoint;
export const getHoveredOverModel = state => state.stormer.hoveredOverModel;

/**
 * Get object of point feature arrays by model name.
 *
 * @param {*} points
 */
const getPointFeaturesByModel = points => {
  // Reduce points to an object of arrays by model name.
  const pointFeaturesByModel = points.reduce((acc, pointFeature) => {
    if (acc[pointFeature.properties.modelCollectionName]) {
      acc[pointFeature.properties.modelCollectionName] = [
        ...acc[pointFeature.properties.modelCollectionName],
        pointFeature
      ];
    } else {
      acc[pointFeature.properties.modelCollectionName] = [pointFeature];
    }
    return acc;
  }, {});

  return pointFeaturesByModel;
};

/**
 * Get array of point features, filtered by timestamp.
 *
 * @param {*} pointFeatures
 * @param {*} timestamp
 */
const getPointFeaturesFilteredByTimestamp = (pointFeatures, timestamp) => {
  // Filter operational model features by current timestamp.
  const filteredByTimestamp = Object.entries(pointFeatures).map(
    ([key, modelFeatures]) => {
      // Get features before or equal to the current timestamp.
      const featuresBeforeTimestamp = modelFeatures.filter(feature =>
        moment(feature.properties.modelRunTimestamp).isSameOrBefore(timestamp)
      );

      let filteredFeatures = [];
      if (featuresBeforeTimestamp.length > 0) {
        // Get last feature in array as the nearest.
        const priorFeature =
          featuresBeforeTimestamp[featuresBeforeTimestamp.length - 1];
        // Now filter features based on the timestamp of the nearest feature.
        filteredFeatures = modelFeatures.filter(
          feature =>
            feature.properties.modelRunTimestamp ===
            priorFeature.properties.modelRunTimestamp
        );
      }

      return { id: key, features: filteredFeatures };
    }
  );

  return filteredByTimestamp;
};

const getFeatureCoords = feature =>
  feature.features.map(feat => feat.geometry.coordinates);

/**
 * Convert an array of points, filtered by model name and timestamp
 * to an array of LineString features.
 *
 * @param {*} points
 * @param {*} timestamp
 */
const convertPointsToLineStringFeature = (points, timestamp) => {
  // Create object where keys are model names, values are array of points.
  const pointFeaturesByModel = getPointFeaturesByModel(points);
  // Filtered array of features, filtered by a timestamp.
  const filteredByTimestamp = getPointFeaturesFilteredByTimestamp(
    pointFeaturesByModel,
    timestamp
  );

  // Map filtered feature points to a LineString feature.
  let lineStringFeatures = [];
  try {
    lineStringFeatures = filteredByTimestamp.map(pointFeature =>
      lineString(getFeatureCoords(pointFeature), {
        model: pointFeature.id,
        timestamp: pointFeature.features[0].properties.modelRunTimestamp
      })
    );
  } catch (error) {
    lineStringFeatures = [];
  }

  return lineStringFeatures;
};

/**
 * Get mapbox map style source for the Actual Storm Path.
 *
 * @param {*} storm
 */
const getActualStormTrackSource = (storm, currentTimestamp) => {
  const timestamp = moment(currentTimestamp);
  const features = storm.actualStormTrackPoints.features.filter(feature =>
    timestamp.isSameOrAfter(feature.properties.modelRunTimestamp)
  );

  if (features.length > 0) {
    return createVectorSource(
      actualSourceId,
      featureCollection([lineString(coordAll(featureCollection(features)))])
    );
  }
};

/**
 * Get mapbox map style source for the Operational Storm Paths i.e. the models.
 *
 * @param {*} storm
 * @param {*} currentTimestamp
 * @param {*} selectedModel
 */
const getOperationalStormTrackSource = (
  storm,
  currentTimestamp,
  selectedModel
) => {
  // Get array of operational LineString features.
  let operationalLineStringFeatures = convertPointsToLineStringFeature(
    storm.operationalStormTrackPoints.features,
    currentTimestamp
  );

  // Get actual storm track points before or same as current timestamp.
  const actualFeatures = storm.actualStormTrackPoints.features.filter(feature =>
    moment(currentTimestamp).isSameOrAfter(feature.properties.modelRunTimestamp)
  );

  // Reverse the order of the actual features, careful, reverse, changes the
  // origin array, which is why I'm destructuring it first.
  const reversed = [...actualFeatures].reverse();

  // Set colour property and start point for operational LineString features.
  operationalLineStringFeatures.forEach((feature, index) => {
    feature.properties.colour = ensembleColorScale[index];

    // Get the starting point for the operational model from the actual points.
    // This is based on the model's run timestamp matching the actual points
    // timestamp.
    const actualStartingPoint = reversed.find(actualFeature =>
      moment(actualFeature.properties.modelRunTimestamp).isBefore(
        feature.properties.timestamp
      )
    );

    // If there is an actual point, set it as the start, otherwise set it to the
    // last actual point.
    feature.geometry.coordinates = [
      actualStartingPoint.geometry.coordinates,
      ...feature.geometry.coordinates
    ];
  });

  if (selectedModel) {
    // Filter Operation LineString feature by model.
    operationalLineStringFeatures = operationalLineStringFeatures.filter(
      feature => feature.properties.model === selectedModel
    );
  }
  const operationalFeatureCollection = featureCollection(
    operationalLineStringFeatures
  );

  return createVectorSource(operationalSourceId, operationalFeatureCollection);
};

/**
 * Get mapbox map style source for the Non-Operational Storm Paths i.e.
 * the models.
 *
 * @param {*} storm
 * @param {*} selectedModel
 * @param {*} hoveredOverModel
 * @param {*} currentTimestamp
 * @param {*} lastPoint
 */
const getNonOperationalStormTracksSource = (
  storm,
  selectedModel,
  hoveredOverModel,
  currentTimestamp
) => {
  // Get actual storm track points before or same as current timestamp.
  const actualFeatures = storm.actualStormTrackPoints.features.filter(feature =>
    moment(currentTimestamp).isSameOrAfter(feature.properties.modelRunTimestamp)
  );

  // Reverse the order of the actual features, careful, reverse, changes the
  // origin array, which is why I'm destructuring it first.
  const reversed = [...actualFeatures].reverse();

  // Filter non-operational storm track features for selected model or hovered over model.
  let nonOperationalLineStringFeatures = storm.nonOperationalStormTrackPoints.features.filter(
    feature => {
      return (
        feature.properties.modelCollectionName === selectedModel ||
        feature.properties.modelCollectionName === hoveredOverModel
      );
    }
  );

  // Get features before or equal to the current timestamp.
  const featuresBeforeTimestamp = nonOperationalLineStringFeatures.filter(
    feature =>
      moment(feature.properties.modelRunTimestamp).isSameOrBefore(
        moment(currentTimestamp)
      )
  );

  // Get last feature in array as the nearest.
  const priorFeature =
    featuresBeforeTimestamp[featuresBeforeTimestamp.length - 1];

  // Now filter selected/hovered over features based on the timestamp of the nearest feature.
  nonOperationalLineStringFeatures = featuresBeforeTimestamp.filter(
    feature =>
      feature.properties.modelRunTimestamp ===
      priorFeature.properties.modelRunTimestamp
  );

  // Filter array into sub-arrays by name property.
  let nonOpLineStringPointsByName = {};
  nonOperationalLineStringFeatures.forEach(point => {
    if (nonOpLineStringPointsByName[point.properties.modelRunName]) {
      // Add point to existing array.
      nonOpLineStringPointsByName[point.properties.modelRunName].push(point);
    } else {
      // Create new array and add point.
      nonOpLineStringPointsByName[point.properties.modelRunName] = [point];
    }
  });

  // Convert object of Point feature arrays to an array of LineString features.
  const lineStrings = Object.entries(nonOpLineStringPointsByName).map(
    ([key, points]) => {
      // Extract each point feature coords into an array of point coords.
      let coords = points.map(feature => feature.geometry.coordinates);
      // Add last actual point to start of coords array.

      // Get the starting point for the operational model from the actual points.
      // This is based on the model's run timestamp matching the actual points
      // timestamp.
      const actualStartingPoint = reversed.find(actualFeature =>
        moment(actualFeature.properties.modelRunTimestamp).isBefore(
          points[0].properties.modelRunTimestamp
        )
      );
      coords = [actualStartingPoint.geometry.coordinates, ...coords];

      const line = lineString(coords);
      line.properties = {
        model: points[0].properties.modelCollectionName,
        timestamp: points[0].properties.modelRunTimestamp,
        name: key
      };

      return line;
    }
  );

  const nonOperationalFeatureCollection = featureCollection(lineStrings);

  return createVectorSource(
    nonOperationalSourceId,
    nonOperationalFeatureCollection
  );
};

/**
 * Get mapbox map style source for the Operational Storm Points i.e.
 * the models.
 *
 * @param {*} storm
 * @param {*} selectedModel
 * @param {*} hoveredOverModel
 * @param {*} currentTimestamp
 */
const getOperationalStormPointsSource = (
  storm,
  selectedModel,
  hoveredOverModel,
  currentTimestamp
) => {
  const pointFeaturesByModel = getPointFeaturesByModel(
    storm.operationalStormTrackPoints.features
  );
  let filteredOperationalPointFeatures = getPointFeaturesFilteredByTimestamp(
    pointFeaturesByModel,
    currentTimestamp
  );

  if (selectedModel || hoveredOverModel) {
    // Filter by selected or hovered over model.
    filteredOperationalPointFeatures = filteredOperationalPointFeatures.filter(
      feature => feature.id === selectedModel || feature.id === hoveredOverModel
    );

    const operationalPointsFeatureCollection = featureCollection(
      filteredOperationalPointFeatures[0].features
    );

    return createVectorSource(
      operationalPointsSourceId,
      operationalPointsFeatureCollection
    );
  }
};

const getNonOperationalStormPointsWindRadiiSource = (
  storm,
  selectedModel,
  hoveredOverModel,
  currentTimestamp,
  windThreshold
) => {
  // Get non-operational features by model, timestamp and name.
  // Filter non-operational storm track features for selected model or hovered over model.
  let nonOperationalFeatures = storm.nonOperationalStormTrackPoints.features.filter(
    feature => {
      return (
        feature.properties.modelCollectionName === selectedModel ||
        feature.properties.modelCollectionName === hoveredOverModel
      );
    }
  );

  // Filter selected/hovered over features by timestamp.
  nonOperationalFeatures = nonOperationalFeatures.filter(
    feature => feature.properties.modelRunTimestamp === currentTimestamp
  );

  // If selected, or hovered over model and `wind radius` option set,
  // create wind radius feature source.
  if (windThreshold && (selectedModel || hoveredOverModel)) {
    // Filter features by those with `maxRadius` matching `windThreshold`.
    nonOperationalFeatures = nonOperationalFeatures.filter(
      feature =>
        feature.properties[`maxRadius${windThreshold}`] &&
        feature.properties[`maxRadius${windThreshold}`] !== 0
    );

    const nonOperationalPointsFeatureCollection = featureCollection(
      nonOperationalFeatures
    );

    return createVectorSource(
      nonOperationalWindRadiiSourceId,
      nonOperationalPointsFeatureCollection
    );
  } else {
    const nonOperationalPointsFeatureCollection = featureCollection(
      nonOperationalFeatures
    );

    return createVectorSource(
      nonOperationalWindRadiiSourceId,
      nonOperationalPointsFeatureCollection
    );
  }
};

const getNonOperationalStormPointForecastSource = (
  storm,
  selectedModel,
  currentTimestamp,
  selectedPoint
) => {
  // If selected, or hovered over model and `wind radius` option set,
  // create wind radius feature source.
  if (selectedModel && selectedPoint) {
    // Get non-operational features by model, timestamp and name.
    // Filter non-operational storm track features for selected model or hovered over model.
    let nonOperationalFeatures = storm.nonOperationalStormTrackPoints.features.filter(
      feature => feature.properties.modelCollectionName === selectedModel
    );

    // Filter selected/hovered over features by timestamp.
    nonOperationalFeatures = nonOperationalFeatures.filter(
      feature => feature.properties.modelRunTimestamp === currentTimestamp
    );

    // Filter features by `modelRunOffset`.
    nonOperationalFeatures = nonOperationalFeatures.filter(
      feature =>
        feature.properties.modelRunOffset === selectedPoint.modelRunOffset
    );
    const nonOperationalPointsFeatureCollection = featureCollection(
      nonOperationalFeatures
    );

    return createVectorSource(
      nonOperationalForecastPointsSourceId,
      nonOperationalPointsFeatureCollection
    );
  } else {
    const nonOperationalPointsFeatureCollection = featureCollection([]);

    return createVectorSource(
      nonOperationalForecastPointsSourceId,
      nonOperationalPointsFeatureCollection
    );
  }
};

/**
 * Construct the storm sources from the current storm feature points, filtered
 * by which model is selected or hovered over and the current timestamp.
 */
const getStormSources = createSelector(
  getCurrentStorm,
  getSelectedModel,
  getHoveredOverModel,
  getCurrentTimestamp,
  getWindThreshold,
  getSelectedOperationalPoint,
  (
    currentStorm,
    selectedModel,
    hoveredOverModel,
    currentTimestamp,
    windThreshold,
    selectedOperationalPoint
  ) => {
    if (currentStorm) {
      // Get actual storm track LineString features source for the
      // current storm.
      const actualStormTracksSource = getActualStormTrackSource(
        currentStorm,
        currentTimestamp
      );

      // Get operational storm track LineString features source for the
      // current storm.
      const operationalStormTracksSource = getOperationalStormTrackSource(
        currentStorm,
        currentTimestamp,
        selectedModel
      );

      // Get operational storm point features source for the current storm, filtered by whether they are selected or hovered over.
      const operationalStormPointsSource = getOperationalStormPointsSource(
        currentStorm,
        selectedModel,
        hoveredOverModel,
        currentTimestamp
      );

      // Get non-operational storm track LineString features source for the current storm, filtered by which model is selected or hovered over.
      const nonOperationalStormTracksSource = getNonOperationalStormTracksSource(
        currentStorm,
        selectedModel,
        hoveredOverModel,
        currentTimestamp
      );

      // Get non-operational storm track LineString features source for the current storm, filtered by which model is selected or hovered over.
      const nonOperationalStormPointsWindRadiiSource = getNonOperationalStormPointsWindRadiiSource(
        currentStorm,
        selectedModel,
        hoveredOverModel,
        currentTimestamp,
        windThreshold
      );

      // Get non-operational storm track LineString features source for the current storm, filtered by which model is selected or hovered over.
      const nonOperationalStormPointForecastSource = getNonOperationalStormPointForecastSource(
        currentStorm,
        selectedModel,
        currentTimestamp,
        selectedOperationalPoint
      );

      let sources = [
        actualStormTracksSource,
        operationalStormTracksSource,
        nonOperationalStormTracksSource,
        operationalStormPointsSource,
        nonOperationalStormPointsWindRadiiSource,
        nonOperationalStormPointForecastSource
      ];

      return sources;
    } else {
      return [];
    }
  }
);

/**
 * Construct the storm layers from the current storm feature points, whether a
 * layer should be included is based on which model is selected or hovered
 * over and the current timestamp.
 */
const getStormLayers = createSelector(
  getCurrentStorm,
  getSelectedModel,
  getHoveredOverModel,
  getWindThreshold,
  getSelectedOperationalPoint,
  (
    currentStorm,
    selectedModel,
    hoveredOverModel,
    windThreshold,
    selectedPoint
  ) => {
    if (currentStorm) {
      // Style actual storm track features.
      const actualStormTracksLayer = createLineLayer({
        id: `${actualSourceId}-layer`,
        sourceId: actualSourceId,
        colour: '#000',
        opacity: 1,
        width: 2
      });

      // Style operational storm track features, the `colour` changes based on
      // `colour` property of the feature and whether the feature is currently
      // hovered over.
      const operationalStormTracksLayer = createLineLayer({
        id: `${operationalSourceId}-layer`,
        sourceId: operationalSourceId,
        colour: [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#000',
          ['get', 'colour']
        ],
        opacity: 1,
        width: 2
      });

      // Add actual and operational storm tracks to layer array.
      let layers = [actualStormTracksLayer, operationalStormTracksLayer];

      // Display layers, only if it's model feature is selected or hovered over.
      if (selectedModel || hoveredOverModel) {
        // Style non-operational storm track features, the `opacity` changes
        // based on whether the feature is currently hovered over.
        const nonOperationalStormTracksLayer = createLineLayer({
          id: `${nonOperationalSourceId}-layer`,
          sourceId: nonOperationalSourceId,
          colour: '#000',
          opacity: [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.3
          ],
          width: 1
        });

        // Style operational storm point circle features, the `colour` changes
        // based on `offset` value and whether the feature is currently
        // selected.
        const operationalStormPointsCircleLayer = createCircleLayer({
          id: `${operationalPointsSourceId}-circle-layer`,
          sourceId: operationalPointsSourceId,
          colour: [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#308014',
            [
              'case',
              ['==', ['get', 'modelRunOffset'], 48],
              tPlus48Color,
              '#fff'
            ]
          ],
          opacity: 1,
          radius: 10,
          strokeWidth: 2
        });

        // Style operational storm point text features, the `text colour`
        // changes based on `offset` value. The text depends on the
        // `maxWindSpeed` property of the feature.
        const operationalStormPointsTextLayer = createSymbolLayer({
          id: `${operationalPointsSourceId}-text-layer`,
          sourceId: operationalPointsSourceId,
          colour: [
            'case',
            ['==', ['get', 'modelRunOffset'], 48],
            '#fff',
            '#000'
          ],
          opacity: 1,
          text: '{maxWindSpeed}'
        });

        layers = [
          ...layers,
          nonOperationalStormTracksLayer,
          operationalStormPointsCircleLayer,
          operationalStormPointsTextLayer
        ];

        // If wind threshold set, then add wind radii layer.
        if (windThreshold !== 0) {
          // Style operational storm point circle features, the `colour` changes
          // based on `offset` value and whether the feature is currently
          // selected.
          const windThresholdKey = `maxRadius${windThreshold}`;
          const nonOperationalStormPointsWindRadiiLayer = createCircleLayer({
            id: `${nonOperationalWindRadiiSourceId}-layer`,
            sourceId: nonOperationalWindRadiiSourceId,
            colour: '#ff0000',
            opacity: 0.3,
            radius: {
              type: 'identity',
              property: windThresholdKey
            },
            strokeWidth: 0
          });

          layers = [...layers, nonOperationalStormPointsWindRadiiLayer];
        }

        // If an operational point has been selected, display forecast points.
        if (selectedPoint) {
          const nonOperationalForecastPointsLayer = createCircleLayer({
            id: `${nonOperationalForecastPointsSourceId}-layer`,
            sourceId: nonOperationalForecastPointsSourceId,
            colour: '#000',
            opacity: 1,
            radius: 3,
            strokeWidth: 0
          });

          layers = [...layers, nonOperationalForecastPointsLayer];
        }
      }

      return layers;
    } else {
      return [];
    }
  }
);

export const isLoading = state => state.stormer.isLoading;

const getSatelliteTimestamps = state => state.stormer.satelliteTimestamps;

const getAcquisitionsSource = createSelector(getAcquisitions, acquisitions => ({
  acquisitions: {
    type: 'geojson',
    data: featureCollection(
      acquisitions.map(feature =>
        circle(
          [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
          12.5,
          {
            properties: { id: feature.id }
          }
        )
      )
    )
  }
}));

const getAcquisitionsLayer = () => ({
  id: 'acquisitions-layer',
  source: 'acquisitions',
  type: 'fill',
  layout: {
    visibility: 'visible'
  },
  paint: {
    'fill-opacity': 0.6,
    'fill-color': 'hsl(338, 49%, 40%)'
  }
});

const getSatelliteSource = createSelector(
  isSatelliteVisible,
  getSatelliteTimestamps,
  getCurrentTimestamp,
  (satelliteVisible, satelliteTimestamps, currentTimestamp) => {
    // Check if we have satellite imagery for the current timestamp.
    const imageryExists = satelliteTimestamps.find(
      timestamp => timestamp === currentTimestamp
    );

    if (satelliteVisible && imageryExists) {
      // FIXME: Only get satellite imagery for dates we have data for,
      //        otherwise we will get lots of 404 errors.
      const url = `https://s3-eu-west-1.amazonaws.com/company-project-rapid/typhoon-watch/${moment(
        currentTimestamp
      ).format('YYYYMMDDTHHmmss[Z]')}/${
        isDayTime(moment(currentTimestamp).toDate()) ? 'vis' : 'tir'
      }/{z}/{x}/{y}.png`;

      return createSatelliteRasterSource(satelliteCoverageSourceId, url);
    }
  }
);

const getSatelliteLayer = createSelector(
  isSatelliteVisible,
  getSatelliteTimestamps,
  getCurrentTimestamp,
  (satelliteVisible, satelliteTimestamps, currentTimestamp) => {
    // Check if we have satellite imagery for the current timestamp.
    const imageryExists = satelliteTimestamps.find(
      timestamp => timestamp === currentTimestamp
    );
    if (satelliteVisible && imageryExists) {
      return createSatelliteRasterLayer({
        id: `${satelliteCoverageSourceId}-layer`,
        sourceId: satelliteCoverageSourceId
      });
    } else {
      return null;
    }
  }
);

const getStormerAdminBoundariesSource = createSelector(
  getCurrentStorm,
  getCurrentTimestamp,
  (currentStorm, currentTimestamp) => {
    // Update admin boundaries with provincial impact data from the storm.
    let adminFeatures = adminBoundaries.features;
    if (currentStorm) {
      if (currentStorm.provinces) {
        // Get provinces impacted by the timestamp just prior to or equal to
        // the current timestamp.
        const provincesByTimestamp = Object.keys(currentStorm.provinces).filter(
          timestamp =>
            moment(currentTimestamp).isSameOrBefore(moment(timestamp))
        );
        // Original code.
        // const provinceByTimestamp = currentStorm.provinces[currentTimestamp];
        const provinceByTimestamp =
          currentStorm.provinces[
            provincesByTimestamp[provincesByTimestamp.length - 1]
          ];

        if (provinceByTimestamp) {
          adminFeatures = adminBoundaries.features.map(feature => {
            provinceByTimestamp.forEach(province => {
              if (feature.properties.Name === province.name) {
                feature.properties.impact = province.impact;
              }
            });
            return feature;
          });
        }
      }
    }

    // Create a vector souce from the new admin boundaries features.
    return createVectorSource(
      'admin-boundaries',
      featureCollection(adminFeatures)
    );
  }
);

const getStormerAdminBoundariesLayer = () => {
  // Get impacted province features from admin boundaries.
  const adminFeatures = adminBoundaries.features;
  const impactedProvinceFeatures = adminFeatures.filter(
    feature => feature.properties.impact
  );
  // Get unique impact values.
  const values = impactedProvinceFeatures.map(
    feature => feature.properties.impact
  );
  const uniqueImpactedValues = new Set(values);

  // Sort values in ascending order, then construct a new array for expression.
  const interpolatedColours = Array.from(uniqueImpactedValues)
    .sort((a, b) => a - b)
    // .flatMap(value => [value, interpolateBlues(value / 100)]);
    .reduce((acc, value) => {
      return [...acc, value, interpolateBlues(value / 100)];
    }, []);

  // If no storm, set to default colour, else construct layer expression, based
  // on `impact` value of the data feature.
  const colour =
    interpolatedColours.length > 0
      ? [
          'case',
          ['==', ['get', 'impact'], null],
          '#f7fbff',
          ['interpolate', ['linear'], ['get', 'impact'], ...interpolatedColours]
        ]
      : '#f7fbff';

  return createFillLayer({
    id: 'admin-boundaries-layer',
    sourceId: 'admin-boundaries',
    colour: colour,
    opacity: ['interpolate', ['linear'], ['zoom'], 7, 0.8, 15, 0.1],
    outlineColour: 'black'
  });
};

export const getMapStyle = createSelector(
  getStormerAdminBoundariesSource,
  getStormerAdminBoundariesLayer,
  getStormSources,
  getStormLayers,
  getAcquisitionsSource,
  getAcquisitionsLayer,
  getSatelliteSource,
  getSatelliteLayer,
  (
    adminBoundariesSource,
    adminBoundariesLayer,
    stormSources,
    stormLayers,
    acquisitionsSource,
    acquisitionsLayer,
    satelliteSource,
    satelliteLayer
  ) => {
    // Extract storm sources from array.
    const [
      actualStormTracksSource,
      operationalStormTracksSource,
      operationalStormPointsSource,
      nonOperationalStormTracksSource,
      nonOperationalStormPointWindRadiiSource,
      nonOperationalStormForecastPointsSource
    ] = stormSources;
    // Construct object of data sources for layers.
    const sources = {
      ...mapStyle.sources,
      ...infrastructureSources,
      ...adminBoundariesSource,
      ...satelliteSource,
      ...actualStormTracksSource,
      ...operationalStormTracksSource,
      ...nonOperationalStormTracksSource,
      ...operationalStormPointsSource,
      ...nonOperationalStormPointWindRadiiSource,
      ...nonOperationalStormForecastPointsSource,
      ...acquisitionsSource
    };

    // Clone the array of layers from the map style.
    let layers = [...mapStyle.layers];

    // Insert boundaries layer beside existing admin layers from the map style
    // and before labels, so labels appear on top of the admin boundaries.
    layers.splice(115, 0, adminBoundariesLayer);

    // Append acquisitions layer.
    layers = [...layers, acquisitionsLayer];

    if (satelliteLayer) {
      layers = [...layers, satelliteLayer];
    }

    if (stormLayers.length > 0) {
      layers = [...layers, ...stormLayers];
    }

    const mapStyleWithLayers = { ...mapStyle, sources, layers };

    return mapStyleWithLayers;
  }
);

const getStorms = state => state.stormer.storms;

/**
 * Map the list of storms to the list structure used by the dropdown
 * MenuButton component.
 *
 * @param {object} this.state.
 *
 * @returns
 */
export const getStormsList = createSelector(getStorms, storms => {
  let stormData = null;

  if (storms) {
    stormData = storms.map(storm => {
      return {
        label: storm.name ? storm.name : storm.reference,
        value: storm.id
      };
    });
  }

  return stormData;
});

/**
 * Get start/end date for whole storm.
 *
 * @param {*} storm
 */
const getOperationalStartEndForStorm = storm => {
  if (storm) {
    // Reduce all points down to an array of start/end moments.
    const dates = storm.operationalStormTrackPoints.features.reduce(
      (acc, point) => {
        if (acc.length === 0) {
          // First point, so add it's timestamp as start/end.
          acc = [
            ...acc,
            point.properties.modelRunTimestamp,
            point.properties.modelRunTimestamp
          ];
        } else {
          if (
            moment(point.properties.modelRunTimestamp).isBefore(moment(acc[0]))
          ) {
            // Point is earlier, so assign it as the start.
            acc[0] = point.properties.modelRunTimestamp;
          }

          if (
            moment(point.properties.modelRunTimestamp).isAfter(moment(acc[1]))
          ) {
            // Point is earlier, so assign it as the start.
            acc[1] = point.properties.modelRunTimestamp;
          }
        }

        return acc;
      },
      []
    );

    return dates;
  }
};

/**
 * Get operational points used by Time Slider.
 */
export const getOperationalPointsByModel = createSelector(
  getCurrentStorm,
  getHoveredOverModel,
  (storm, selectedModel) => {
    if (storm) {
      const dates = getOperationalStartEndForStorm(storm);
      // Filter operational
      const pointFeaturesByModel = getPointFeaturesByModel(
        storm.operationalStormTrackPoints.features
      );

      // Filter by unique timestamp.
      let points = {};
      Object.keys(pointFeaturesByModel).forEach((key, index) => {
        let timestamps = [];
        const features = pointFeaturesByModel[key]
          .filter(feature => {
            if (
              !timestamps.find(
                timestamp => timestamp === feature.properties.modelRunTimestamp
              )
            ) {
              timestamps = [
                ...timestamps,
                feature.properties.modelRunTimestamp
              ];

              return feature;
            } else {
              return false;
            }
          })
          .map(feature => {
            // Map features to data structure for Time Slider.
            // FIXME: Try to get the Padded date from some function, so it can
            //        be re-used in the time-slider component.
            const isSelected =
              feature.properties.modelCollectionName === selectedModel;

            return {
              currentModel: isSelected,
              timestamp: feature.properties.modelRunTimestamp,
              startDate: moment(dates[0]),
              endDate: moment(dates[1])
            };
          });

        points[key] = { features, color: ensembleColorScale[index] };
      });

      return points;
    }
  }
);

export const getStartEndDates = createSelector(getCurrentStorm, storm => {
  if (storm) {
    return getOperationalStartEndForStorm(storm);
  }
});

/**
 * Get operational points used by Time Slider.
 */
export const getSatellitePointsByTimestamp = createSelector(
  getCurrentStorm,
  getSatelliteTimestamps,
  getStartEndDates,
  (storm, satelliteTimestamps, startEndDates) => {
    if (storm) {
      // Filter satellite timestamps to those within the start/end dates.
      const filteredTimestamps = satelliteTimestamps.filter(timestamp =>
        moment(timestamp).isBetween(
          startEndDates[0],
          startEndDates[1],
          null,
          '[]'
        )
      );

      // Map the timestamps to an object used by the Time Slider Track
      // component.
      const mappedFeatures = filteredTimestamps.map(timestamp => ({
        currentModel: false,
        timestamp,
        startDate: moment(startEndDates[0]),
        endDate: moment(startEndDates[1])
      }));

      return { color: 'grey', features: mappedFeatures };
    }
  }
);
