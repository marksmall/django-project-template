import { useState } from 'react';

const useTree = map => {
  const [nodes, setNodes] = useState([]);
  if (map) {
    console.log('MAP STYLE: ', map.getStyle());
  }
  const getRootNodes = () => {
    console.log('GETTING ROOT NODES');
    return [];
  };

  const getChildNodes = node => {
    console.log('GETTING CHILD NODES FOR: ', node);
    return [];
  };

  return {
    nodes,
    getRootNodes,
    getChildNodes
  };
  // }
};

export default useTree;
