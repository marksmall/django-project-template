import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { login } from './accounts.actions';
import { getUser } from './accounts.selector';

import LoginForm from './login-form.component';

const mapStateToProps = (state, props) => ({
  user: getUser(state),
  from: props.location.state ? props.location.state.from || { pathname: '/' } : { pathname: '/' }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
