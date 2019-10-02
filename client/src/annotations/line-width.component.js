import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import styles from './line-width.module.css';
import Button from '../ui/button.component';

const LineWidth = ({ select }) => {
  return (
    <div className={styles.lineWidthContainer}>
      <Button className={styles.lineWidth} onClick={() => select(1)} dataFor="lineWidth1">
        <span style={{ width: 20, height: 1, backgroundColor: '#000' }}></span>
      </Button>
      <ReactTooltip id="lineWidth1">
        <span>Set Line Width to 1px</span>
      </ReactTooltip>

      <Button className={styles.lineWidth} onClick={() => select(2)} dataFor="lineWidth2">
        <span style={{ width: 20, height: 2, backgroundColor: '#000' }}></span>
      </Button>
      <ReactTooltip id="lineWidth2">
        <span>Set Line Width to 2px</span>
      </ReactTooltip>

      <Button className={styles.lineWidth} onClick={() => select(3)} dataFor="lineWidth3">
        <span style={{ width: 20, height: 3, backgroundColor: '#000' }}></span>
      </Button>
      <ReactTooltip id="lineWidth3">
        <span>Set Line Width to 3px</span>
      </ReactTooltip>
    </div>
    // <ul className={styles.lineWidthContainer}>
    //   <li onClick={() => setLineWidth(1)}>
    //     <div className={styles.lineWidth1}></div>
    //   </li>
    //   <li onClick={() => setLineWidth(2)}>
    //     <div className={styles.lineWidth2}></div>
    //   </li>
    //   <li onClick={() => setLineWidth(3)}>
    //     <div className={styles.lineWidth3}></div>
    //   </li>
    // </ul>
  );
};

LineWidth.propTypes = {
  select: PropTypes.func.isRequired
};

export default LineWidth;
