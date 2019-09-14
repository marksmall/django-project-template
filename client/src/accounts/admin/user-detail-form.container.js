import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createUser } from './users.actions';
import UserDetailForm from './user-detail-form.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({ createUser }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailForm);
