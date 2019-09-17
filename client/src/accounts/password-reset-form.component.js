import React from 'react';
import PropTypes from 'prop-types';

import useForm from '../hooks/useForm';
import validate from './password-reset-form.validator';

import Button from '../ui/button.component';
// import Button from 'astrosat-ui';

import styles from './password-reset-form.module.css';

const PasswordResetForm = ({ resetPassword }) => {
  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    resetPassword(values);
  }

  return (
    <div className={styles['password-reset-form-container']}>
      <form className={styles['password-reset-form']} onSubmit={handleSubmit}>
        <h3>Reset Password</h3>

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Email Address:
            <input
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              type="email"
              name="email"
              onChange={handleChange}
              value={values.email || ''}
              required
              autoFocus
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.email && <p className={styles['error-message']}>{errors.email}</p>}

        <div className={styles.buttons}>
          <Button type="reset" className={styles.button} onClick={reset} disabled={Object.keys(values).length === 0}>
            Reset
          </Button>

          <Button
            type="submit"
            className={styles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
};

PasswordResetForm.propTypes = {
  resetPassword: PropTypes.func.isRequired
};

export default PasswordResetForm;
