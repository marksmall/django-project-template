import React, { useState } from 'react';
import PropTypes from 'prop-types';

import useMap from '../map/use-map.hook';

import styles from './layer-tree.module.css';

const LayerNode = ({ node, toggleLayerVisibility }) => {
  return (
    <li key={node.label}>
      <label>
        <input
          type="checkbox"
          name="layer"
          onChange={event => toggleLayerVisibility(event.target.value)}
          value={node.label}
          checked={node.visible}
        />
        {node.label}
      </label>
    </li>
  );
};

const LayerTree = ({ map }) => {
  const [nodes, setNodes] = useState(null);

  useMap(
    map,
    mapInstance => {
      const layers = mapInstance.getStyle().layers;
      const layerNodes = layers.map(layer => ({
        label: layer.id,
        visible: true
      }));

      setNodes(layerNodes);
    },
    [setNodes]
  );

  const toggleLayerVisibility = layer => {
    const visibility = map.getLayoutProperty(layer, 'visibility');
    const node = nodes.find(node => node.label === layer);
    if (visibility === undefined || visibility === 'visible') {
      map.setLayoutProperty(layer, 'visibility', 'none');
      node.visible = false;
    } else {
      map.setLayoutProperty(layer, 'visibility', 'visible');
      node.visible = true;
    }

    setNodes([...nodes]);
  };

  return (
    <div className={styles.layerPanel}>
      <ul>
        {nodes &&
          nodes.map(node => (
            <LayerNode toggleLayerVisibility={toggleLayerVisibility} key={node.label} node={node} map={map} />
          ))}
      </ul>
    </div>
  );
};

LayerTree.propTypes = {
  // map: PropTypes.object.isRequired
};

export default LayerTree;
