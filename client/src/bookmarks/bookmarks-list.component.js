import React from 'react';
import PropTypes from 'prop-types';

import styles from './bookmarks-panel.module.css';

const BookmarkList = ({ bookmarks, selectBookmark }) => {
  return (
    <div className={styles.panel}>
      {bookmarks && bookmarks.length > 0 ? (
        <ul>
          {bookmarks.map(bookmark => {
            return (
              <li key={bookmark.title} onClick={() => selectBookmark(bookmark)}>
                {bookmark.title}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No Bookmarks</p>
      )}
    </div>
  );
};

BookmarkList.propTypes = {
  bookmarks: PropTypes.array,
  selectBookmark: PropTypes.func.isRequired
};

export default BookmarkList;
