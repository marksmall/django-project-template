import React from 'react';
import PropTypes from 'prop-types';

import useForm from '../hooks/useForm';
import validate from './password-change-form.validator';

import Button from '../ui/button.component';
// import Button from 'astrosat-ui';

import styles from './password-change-form.module.css';

const PasswordChangeForm = ({ changePassword }) => {
  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    changePassword(values);
  }

  return (
    <div className={styles['password-change-form-container']}>
      <form className={styles['password-change-form']} onSubmit={handleSubmit}>
        <h3>Change Password</h3>

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Old Password:
            <input
              className={`${styles.input} ${errors.old_password ? styles.error : ''}`}
              type="password"
              name="old_password"
              onChange={handleChange}
              value={values.old_password || ''}
              required
              autoFocus
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.old_password && <p className={styles['error-message']}>{errors.old_password}</p>}

        <div className={styles['form-row']}>
          <label className={styles.label}>
            New Password:
            <input
              className={`${styles.input} ${errors.new_password1 ? styles.error : ''}`}
              type="password"
              name="new_password1"
              onChange={handleChange}
              value={values.new_password1 || ''}
              required
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.new_password1 && <p className={styles['error-message']}>{errors.new_password1}</p>}

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Password (Confirm):
            <input
              className={`${styles.input} ${errors.new_password2 ? styles.error : ''}`}
              type="password"
              name="new_password2"
              onChange={handleChange}
              value={values.new_password2 || ''}
              required
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.new_password2 && <p className={styles['error-message']}>{errors.new_password2}</p>}

        <div className={styles.buttons}>
          <Button className={styles.button} onClick={reset} disabled={Object.keys(values).length === 0}>
            Reset
          </Button>

          <Button
            type="submit"
            className={styles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

PasswordChangeForm.propTypes = {
  changePassword: PropTypes.func.isRequired
};

export default PasswordChangeForm;
