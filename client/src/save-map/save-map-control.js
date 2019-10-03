import './save-map-control.css';

import * as FileSaver from 'file-saver';

import saveMap from './save-map.svg';
class SaveMapControl {
  /**
   * When adding control to a map, set the default value and set
   * the content to update when the mouse moves.
   *
   * @param {*} map
   *
   * @returns
   *
   * @memberof SaveMapControl
   */
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('button');
    this.container.className = 'mapboxgl-ctrl save-map-control';

    const icon = document.createElement('img');
    icon.src = saveMap;
    icon.className = 'icon';
    this.container.appendChild(icon);

    this.container.onclick = event => {
      console.log('Button clicked: ', event);
      map.getCanvas().toBlob(blob => {
        FileSaver.saveAs(blob, 'snapshot.png');
      });
    };

    return this.container;
  }

  /**
   *
   *
   * @memberof SaveMapControl
   */
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

export default SaveMapControl;
