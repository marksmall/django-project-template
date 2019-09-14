import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { register } from './accounts.actions';

import RegisterForm from './register-form.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      register
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);
