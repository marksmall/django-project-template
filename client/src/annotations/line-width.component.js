import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import Button from '../ui/button.component';

import styles from './line-width.module.css';

const LineWidth = ({ options, select }) => (
  <div className={styles.lineWidthContainer}>
    {options.map(option => (
      <React.Fragment key={option.id}>
        <Button className={styles.lineWidth} onClick={() => select(option)} dataFor={option.id}>
          <img className={styles.icon} src={option.icon} alt={option.tooltip} />
        </Button>
        <ReactTooltip id={option.id}>
          <span>{option.tooltip}</span>
        </ReactTooltip>
      </React.Fragment>
    ))}
  </div>
);

LineWidth.propTypes = {
  select: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired
};

export default LineWidth;
