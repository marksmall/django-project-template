import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import UserTable from './user-table.component';
import UserDetailFormContainer from './user-detail-form.container';
import Button from '../../ui/button.component';

import styles from './user-list.module.css';

const UserList = ({ users, fetchUsers, deleteUser, updateUser, copyUser }) => {
  useEffect(() => {
    if (!users) {
      fetchUsers();
    }
  }, [users, fetchUsers]);

  const [isNewUserMode, setIsNewUserMode] = useState(false);

  return (
    <div className={styles['table-container']}>
      <h3>Maintain Users</h3>

      <p className={styles.strapline}>
        <strong>NOTE:</strong> Use actions within table to update user(s)
      </p>

      <UserTable data={users} deleteUser={deleteUser} updateUser={updateUser} copyUser={copyUser} />

      <Button onClick={() => setIsNewUserMode(!isNewUserMode)}>New User</Button>

      {isNewUserMode && <UserDetailFormContainer />}
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.array,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  copyUser: PropTypes.func.isRequired
};

export default UserList;
