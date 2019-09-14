import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changePassword } from './accounts.actions';

import PasswordChangeForm from './password-change-form.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePassword
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordChangeForm);
