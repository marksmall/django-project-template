import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUsers } from './users.selector';
import { fetchUsers, createUser, deleteUser, updateUser, copyUser } from './users.actions';

import UserList from './user-list.component';

const mapStateToProps = state => ({ users: getUsers(state) });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUsers, createUser, deleteUser, updateUser, copyUser }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
