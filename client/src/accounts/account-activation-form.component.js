import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import useForm from '../hooks/useForm';
import validate from './account-activation-form.validator';

import Button from '../ui/button.component';
// import Button from 'astrosat-ui';

import styles from './account-activation-form.module.css';

const AccountActivationForm = ({ activateAccount, props }) => {
  const { handleSubmit } = useForm(onSubmit, validate);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  function onSubmit() {
    activateAccount({ key: props.match.params.key });
    setRedirectToLogin(true);
  }

  // Re-direct to login.
  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={styles['account-activation-form-container']}>
      <form className={styles['account-activation-form']} onSubmit={handleSubmit}>
        <h3>Account Activation</h3>

        <div className={styles.buttons}>
          <Button
            type="submit"
            className={styles.button}
            // disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Activate Account
          </Button>
        </div>
      </form>
    </div>
  );
};

AccountActivationForm.propTypes = {
  activateAccount: PropTypes.func.isRequired,
  props: PropTypes.object.isRequired
};

export default AccountActivationForm;
