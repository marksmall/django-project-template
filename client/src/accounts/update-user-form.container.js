import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUser } from './accounts.selector';

import { updateUser } from './accounts.actions';

import UpdateUserForm from './update-user-form.component';

const mapStateToProps = state => ({
  user: getUser(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUser
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateUserForm);
