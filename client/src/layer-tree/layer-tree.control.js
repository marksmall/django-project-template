import './layer-tree.control.css';

class LayerTreeControl {
  constructor(opts) {
    this.opts = opts || {};
  }

  onAdd(map) {
    this.map = map;

    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl layer-tree-control';

    //layer manager bounding box
    var layerPanel = document.createElement('div');
    layerPanel.className = 'layer-panel';

    //legend ui
    var legend = document.createElement('div');
    legend.className = 'legend';

    this.container.appendChild(layerPanel);
    this.container.appendChild(legend);

    console.log('LAYERS: ', this.getLayers(map));
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

  getLayers() {
    return this.map.getStyle().layers;
  }
}

export default LayerTreeControl;
