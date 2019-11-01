import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as VisibleIcon } from './visible.svg';
import { ReactComponent as InvisibleIcon } from './visible.svg';

import styles from './password-field.module.css';

const PasswordField = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div>
      <input type={isVisible ? 'text' : 'password'} />
      <button onClick={toggleVisibility}>{isVisible ? <InvisibleIcon className={styles.icon} /> : <VisibleIcon className={styles.icon} />}</button>
    </div>
  );
};

PasswordField.propTypes = {};

export default PasswordField;
