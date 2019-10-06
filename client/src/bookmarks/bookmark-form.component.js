import React from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import useForm from '../hooks/useForm';
import validate from './bookmark-form.validator';

import Button from '../ui/button.component';

import styles from './bookmark-form.module.css';

const BookmarkForm = ({ submit }) => {
  function onSubmit() {
    console.log('Submitting Form');
    submit(values);
  }

  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Save Bookmark</h3>

      <input
        className={`${styles.input} ${errors.bookmark ? styles.error : ''}`}
        type="text"
        name="bookmark"
        onChange={handleChange}
        value={values.bookmark || ''}
        required
        autoFocus
      />
      {errors.bookmark && <p className={styles.errorMessage}>{errors.bookmark}</p>}

      <div className={styles.buttons}>
        <Button
          type="submit"
          className={styles.button}
          // disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
        >
          Save Bookmark
        </Button>
      </div>
    </form>
  );
};

BookmarkForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default BookmarkForm;
