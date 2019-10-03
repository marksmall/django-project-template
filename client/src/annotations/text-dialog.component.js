import React from 'react';
// import PropTypes from 'prop-types'

import LabelForm from './label-form.component';

import styles from './text-dialog.module.css';

const TextDialog = () => {
  return (
    <div className={styles.textDialog}>
      <LabelForm />
    </div>
  );
};

// TextDialog.propTypes = {

// }

export default TextDialog;
