import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetPassword } from './accounts.actions';

import PasswordResetForm from './password-reset-form.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetPassword
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetForm);
