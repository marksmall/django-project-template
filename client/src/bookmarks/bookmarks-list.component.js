import React from 'react';
import PropTypes from 'prop-types';

import styles from './bookmarks-panel.module.css';

const BookmarkList = ({ bookmarks }) => {
  return (
    <div className={styles.panel}>
      {bookmarks.length > 0 ? (
        <ul>
          {bookmarks.map(bookmark => {
            return <li>{bookmark.name}</li>;
          })}
        </ul>
      ) : (
        <p>No Bookmarks</p>
      )}
    </div>
  );
};

BookmarkList.propTypes = {
  bookmarks: PropTypes.array.isRequired
};

export default BookmarkList;
