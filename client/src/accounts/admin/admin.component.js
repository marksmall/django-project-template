import React from 'react';
import { Link } from 'react-router-dom';

import styles from './admin.module.css';

const Admin = () => (
  <div>
    <ul className={styles.nav}>
      <li>
        <Link className={styles['nav-item']} to="/users">
          Admin Users
        </Link>
      </li>
      <li>
        <Link className={styles['nav-item']} to="/others">
          Admin Others
        </Link>
      </li>
    </ul>
  </div>
);

export default Admin;
