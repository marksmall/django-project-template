import React from 'react';
import PropTypes from 'prop-types';

import parseISO from 'date-fns/parseISO';
import formatDate from '../utils/formatDate';

import styles from './infrastructure-detail.module.css';

const InfrastructureDetail = ({ feature }) => (
  <ul className={styles.list}>
    <li>
      <span className={styles.label}>Organisation Code:</span>
      <span>{feature.properties.organisation_code}</span>
    </li>
    <li>
      <span className={styles.label}>Organisation Name:</span>
      <span>{feature.properties.organisation_name}</span>
    </li>
    <li>
      <span className={styles.label}>Address:</span>
      <ul className={styles.address}>
        <li>{feature.properties.address_1}</li>
        <li>{feature.properties.address_2}</li>
        <li>{feature.properties.address_3}</li>
        <li>{feature.properties.address_4}</li>
        <li>{feature.properties.address_5}</li>
      </ul>
    </li>
    <li>
      <ul className={styles.row}>
        <li className={styles['pad-right']}>
          <span className={styles.label}>Postcode:</span>
          <span>{feature.properties.postcode}</span>
        </li>
        <li>
          <span className={styles.label}>Phone Number:</span>
          <span>{feature.properties.phone_number}</span>
        </li>
      </ul>
    </li>
    <li>
      <span className={styles.label}>Open Date:</span>
      <span>
        {feature.properties.open_date && feature.properties.open_date !== 'null' // weird check here as it looks like mapbox converts null properties to string "null".
          ? formatDate(parseISO(feature.properties.open_date))
          : 'N/A'}
      </span>
    </li>
    <li>
      <span className={styles.label}>Close Date:</span>
      <span>
        {feature.properties.close_date &&
        feature.properties.close_date !== 'null' // weird check here as it looks like mapbox converts null properties to string "null".
          ? formatDate(parseISO(feature.properties.close_date))
          : 'N/A'}
      </span>
    </li>
  </ul>
);

InfrastructureDetail.propTypes = {
  feature: PropTypes.object.isRequired
};

export default InfrastructureDetail;
