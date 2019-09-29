import React, { useState } from 'react';

import Button from '../ui/button.component';
import { ReactComponent as AnnotationsIcon } from './annotations.svg';

import AnnotationsPanel from './annotations-panel.component';

import styles from './annotations.module.css';

const Annotations = ({ map }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.annotations}>
      <Button shape="round" onClick={() => setIsOpen(!isOpen)}>
        <AnnotationsIcon className={styles.icon} />
      </Button>

      {isOpen && <AnnotationsPanel map={map} />}
    </div>
  );
};

export default Annotations;
