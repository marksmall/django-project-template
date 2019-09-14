import React from 'react';
import PropTypes from 'prop-types';

import useForm from '../hooks/useForm';
import validate from './update-user-form.validator';

import Button from '../ui/button.component';
// import Button from 'astrosat-ui';

import styles from './update-user-form.module.css';

const UpdateUserForm = ({ user, updateUser }) => {
  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    updateUser(values);
  }

  return (
    <div className={styles['update-user-form-container']}>
      <form className={styles['update-user-form']} onSubmit={handleSubmit}>
        <h3>Update User</h3>

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Username:
            <input className={styles.input} type="text" name="username" value={user.username} readOnly />
          </label>
        </div>

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Email Address:
            <input className={styles.input} type="email" name="email" value={user.email} readOnly />
          </label>
        </div>

        <div className={styles['form-row']}>
          <label className={styles.label}>
            First Name:
            <input
              className={`${styles.input} ${errors.first_name ? styles.error : ''}`}
              type="text"
              name="first_name"
              onChange={handleChange}
              value={values.first_name || user.first_name || ''}
              placeholder="First Name"
              autoFocus
            />
          </label>
        </div>
        {errors.first_name && <p className={styles['error-message']}>{errors.first_name}</p>}

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Last Name:
            <input
              className={`${styles.input} ${errors.last_name ? styles.error : ''}`}
              type="text"
              name="last_name"
              onChange={handleChange}
              value={values.last_name || user.last_name || ''}
            />
          </label>
        </div>
        {errors.last_name && <p className={styles['error-message']}>{errors.last_name}</p>}

        <div className={styles.buttons}>
          <Button className={styles.button} onClick={reset} disabled={Object.keys(values).length === 0}>
            Reset
          </Button>

          <Button
            type="submit"
            className={styles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Update User
          </Button>
        </div>
      </form>
    </div>
  );
};

UpdateUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired
};

export default UpdateUserForm;
