import React from 'react';
// import PropTypes from 'prop-types'

import ReactTooltip from 'react-tooltip';

import useForm from '../hooks/useForm';
import validate from './label-form.validator';

import Button from '../ui/button.component';

import styles from './text-dialog.module.css';

const LabelForm = () => {
  function onSubmit() {
    console.log('Submitting Form');
  }

  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  return (
    <form className={styles.labelForm} onSubmit={handleSubmit}>
      <h3>Add Label</h3>

      <label>
        <strong>Label Title:</strong>
        <input type="text" onChange={handleChange} value={values.title || ''} placeholder="Label" required autoFocus />
      </label>
      <label>
        <strong>Label Description:</strong>
        <textarea rows="5" cols="20" placeholder="Description" />
      </label>

      <span className={styles.buttons}>
        <Button type="button" className={styles.button} onClick={console.log('Close Label Dialog')} dataFor="cancel">
          Cancel
        </Button>
        <ReactTooltip id="cancel">
          <span>Cancel adding Label</span>
        </ReactTooltip>

        <Button
          type="submit"
          className={styles.button}
          disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          dataFor="submit"
        >
          Add
        </Button>
        <ReactTooltip id="submit">
          <span>Add Label to Map</span>
        </ReactTooltip>
      </span>
    </form>
  );
};

// LabelForm.propTypes = {

// }

export default LabelForm;
