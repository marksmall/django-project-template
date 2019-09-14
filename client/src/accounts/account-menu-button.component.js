import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ReactComponent as ProfileIcon } from './profile.svg';
// import AuthenticatedIcon from './hibs-badge.jpg';

import styles from './account-menu-button.module.css';

const AccountMenuButton = ({ user, logout }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menu = useRef(null);

  return (
    <div className={styles['menu-button-container']}>
      <button
        className={styles.button}
        onClick={() => setIsMenuVisible(!isMenuVisible)}
        onBlur={event => {
          // If clicked on button in menu, then fire it's click event.
          if (event && event.relatedTarget) {
            event.relatedTarget.click();
          }

          // If click outside, close menu.
          if (menu.current && !menu.current.contains(event.relatedTarget)) {
            setIsMenuVisible(false);
          }
        }}
      >
        <ProfileIcon className={styles.profile} />
        {/* <img className={styles.profile} src={AuthenticatedIcon} alt="avatar" /> */}
        {/* <div
          // className={styles.avatar}
          style={{
            background: 'url("hibs-badge.jpg") no-repeat',
            backgroundSize: 'contain',
            width: '100%',
            height: '100%'
          }}
        /> */}
      </button>

      {isMenuVisible && (
        <ul ref={menu} className={styles.menu}>
          <li className={styles['menu-item']}>
            <p className={styles['menu-header']}>
              You are Logged in as:{' '}
              <strong>
                {user.first_name} {user.last_name}
              </strong>
            </p>
          </li>
          <li className={styles['menu-item']}>
            <Link className={styles['menu-action']} to="/user/update">
              Your Profile
            </Link>
          </li>
          <li className={styles['menu-item']}>
            <Link className={styles['menu-action']} to="/password/change">
              Change Password
            </Link>
          </li>
          <li className={styles['menu-item']}>
            <button className={styles['menu-action']} onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

AccountMenuButton.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

export default AccountMenuButton;
