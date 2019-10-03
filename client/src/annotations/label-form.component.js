import React from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import useForm from '../hooks/useForm';
import validate from './label-form.validator';

import Button from '../ui/button.component';

import styles from './label-form.module.css';

const LabelForm = ({ submit }) => {
  function onSubmit() {
    console.log('Submitting Form');
    submit(values);
  }

  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  return (
    <form className={styles['login-form']} onSubmit={handleSubmit}>
      <h3>Add Label</h3>

      <input
        className={`${styles.input} ${errors.label ? styles.error : ''}`}
        type="text"
        name="label"
        onChange={handleChange}
        value={values.label || ''}
        required
        autoFocus
      />
      {errors.username && <p className={styles['error-message']}>{errors.username}</p>}

      <div className={styles.buttons}>
        <Button
          type="submit"
          className={styles.button}
          // disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
        >
          Add Label
        </Button>
      </div>
    </form>
  );
};

LabelForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default LabelForm;
