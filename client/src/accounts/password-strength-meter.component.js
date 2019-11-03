import React, { useState } from 'react';
import PropTypes from 'prop-types';

import zxcvbn from 'zxcvbn';

import styles from './password-strength-meter.module.css';

const passwordStrength = score => {
  switch (score) {
    case 0:
      return 'Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Weak';
  }
};

const PasswordStrengthMeter = ({ password }) => {
  const passwordResult = password ? zxcvbn(password) : { score: 0, feedback: { suggestions: [] } };
  const strength = passwordStrength(passwordResult.score);
  console.log('PASSWORD STRENGTH: ', password, passwordResult, strength, styles[strength]);
  return (
    <div>
      <progress className={`${styles.passwordMeter} ${styles[strength]}`} value={passwordResult.score} max="4" />
      <div>
        <strong>Password Strength:</strong>&nbsp;{strength}
      </div>
      <ul>
        {passwordResult.feedback.suggestions.map(suggestion => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string
};

export default PasswordStrengthMeter;
