import React from 'react';
import Button from './button.component';
import { ReactComponent as InfoIcon } from './info.svg';
import styles from './info-button.module.css';

const InfoButton = props => (
  <Button padded={false} {...props}>
    <InfoIcon className={styles.info} />
  </Button>
);

export default InfoButton;
