import React, { Component } from 'react';

import { Popup, ScaleControl, NavigationControl } from 'mapbox-gl';
import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import * as FileSaver from 'file-saver';

import LoadMask from '../load-mask/load-mask.component';
import CursorCoords from '../cursor-coords/cursor-coords.component';

import style from './map.module.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const MapboxGl = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
  maxZoom: 20,
  preserveDrawingBuffer: true
});

class Map extends Component {
  map = null;
  popup = null;
  center = [111.0, 12.0];
  zoom = [5.5];
  state = {
    lat: 12.0,
    lng: 111.0
  };

  addAcquisition = lngLat => {
    return this.props.addAcquisition({
      type: 'Point',
      coordinates: [lngLat.lng, lngLat.lat]
    });
  };

  displayPopup = (feature, lngLat, map) => {
    // Convert feature into a list of formatted key/value pairs to display.
    const content = Object.keys(feature.properties).map(key => `${key}: ${feature.properties[key]}`);
    // Reduce the list to a string of paragraph elements.
    const popupContent = content.reduce((acc, keyValue) => {
      return (acc += `<p>${keyValue}</p>`);
    });

    // Create a new popup with the content and add it to the map.
    new Popup()
      .setLngLat(lngLat)
      .setHTML(popupContent)
      .addTo(map);
  };

  onClick = (map, event) => {
    const { point, lngLat } = event;
  };

  onMouseMove = (map, event) => {
    const { lngLat } = event;

    // Update local state with the current mouse cursor lat/lng values.
    this.setState({ lat: lngLat.lat, lng: lngLat.lng });
  };

  componentDidUpdate = () => {
    // Force map to resize.
    // This is done by passing in the mapHeight prop.
    if (this.map && this.map.state.map) {
      this.map.state.map.resize();
    }
  };

  pointerOnHover = (mode, map) => {};

  featureOnHover = map => {};

  updateMeasurement = event => {
    console.log('DRAW EVENT: ', event);
  };

  onStyleLoad = map => {
    map.addControl(new ScaleControl(), 'bottom-left');
    map.addControl(new NavigationControl({ showCompass: false }), 'top-left');

    // Add geocoder control to map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN
      })
    );

    // Add mapbox draw tools.
    // FIXME: This causes an error when hovering over operational storm track models. The error is: `The layer 'gl-draw-polygon-fill-inactive.cold' does not exist in the map's style and cannot be queried for features`.
    map.addControl(new MapboxDraw(), 'top-right');
    map.on('draw.create', this.updateMeasurement);
    map.on('draw.delete', this.updateMeasurement);
    map.on('draw.update', this.updateMeasurement);
  };

  /**
   * Save image of map as a PNG to the file-system.
   *
   * @memberof StormerMap
   */
  saveMap = () => {
    if (this.map && this.map.state.map) {
      this.map.state.map.getCanvas().toBlob(blob => {
        FileSaver.saveAs(blob, 'snapshot.png');
      });
    }
  };

  render() {
    const { loading, mapStyle } = this.props;

    const SaveMapButton = () => (
      <button className={style['save-map-btn']} onClick={this.saveMap}>
        Save Map
      </button>
    );

    return (
      <div>
        {loading && <LoadMask />}

        <MapboxGl
          style="mapbox://styles/mapbox/light-v9"
          containerStyle={{ height: '100vh', width: '100vw' }}
          center={this.center}
          zoom={this.zoom}
          onStyleLoad={this.onStyleLoad}
          onMouseMove={this.onMouseMove}
          onClick={this.onClick}
          ref={el => (this.map = el)}
        >
          <SaveMapButton />
          <CursorCoords lat={this.state.lat} lng={this.state.lng} />
        </MapboxGl>
      </div>
    );
  }
}

export default Map;
