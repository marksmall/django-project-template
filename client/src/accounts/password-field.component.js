import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as VisibleIcon } from './visible.svg';
import { ReactComponent as InvisibleIcon } from './invisible.svg';

import styles from './password-field.module.css';

const PasswordField = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className={styles.passwordField}>
      <input className={styles.passwordInput} type={isVisible ? 'text' : 'password'} />
      <button className={styles.passwordButton} onClick={toggleVisibility}>
        {isVisible ? <InvisibleIcon className={styles.icon} /> : <VisibleIcon className={styles.icon} />}
      </button>
    </div>
  );
};

PasswordField.propTypes = {};

export default PasswordField;
