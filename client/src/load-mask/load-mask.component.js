import React from 'react';

import styles from './load-mask.module.css';

const LoadMask = () => (
  <div className={`${styles['load-mask']}`}>
    <svg width="100px" height="100px" viewBox="0 0 1000 1000">
      <circle cx="500" cy="570" r="80" />
      <circle
        cx="500"
        cy="570"
        r="200"
        strokeWidth="10"
        stroke="black"
        fill="none"
      />
      <circle
        cx="500"
        cy="666"
        r="300"
        strokeWidth="10"
        stroke="black"
        fill="none"
      />
      <circle
        cx="500"
        cy="500"
        r="470"
        strokeWidth="10"
        stroke="black"
        fill="none"
      />
      <g
        style={{
          animation: '3s linear infinite spin',
          transformOrigin: '50% 57%'
        }}
      >
        <circle cx="300" cy="570" r="30" strokeWidth="10" stroke="white" />
      </g>
      <g
        style={{
          animation: '4s linear infinite spin',
          transformOrigin: '50% 66.6%'
        }}
      >
        <circle cx="500" cy="366" r="30" strokeWidth="10" stroke="white" />
      </g>
      <g
        style={{
          animation: '5s linear infinite spin',
          transformOrigin: '50% 50%'
        }}
      >
        <circle cx="500" cy="30" r="30" strokeWidth="10" stroke="white" />
      </g>
      {/* <g className={styles.spinner3}>
        <circle cx="300" cy="570" r="30" strokeWidth="10" stroke="white" />
      </g>
      <g className={styles.spinner4}>
        <circle cx="500" cy="366" r="30" strokeWidth="10" stroke="white" />
      </g>
      <g className={styles.spinner5}>
        <circle cx="500" cy="30" r="30" strokeWidth="10" stroke="white" />
      </g> */}
    </svg>
  </div>
);

export default LoadMask;
