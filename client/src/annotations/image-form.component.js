import React from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import useForm from '../hooks/useForm';
import validate from './label-form.validator';

import Button from '../ui/button.component';

import styles from './form.module.css';

const ImageForm = ({ submit }) => {
  function onSubmit() {
    console.log('Submitting Form: ', values);
    submit(values.image);
  }

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Add Image</h3>

      <input
        className={`${styles.input} ${errors.image ? styles.error : ''}`}
        type="text"
        name="image"
        onChange={handleChange}
        value={values.image || ''}
        required
        autoFocus
      />
      {errors.image && <p className={styles.errorMessage}>{errors.image}</p>}

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

ImageForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default ImageForm;
