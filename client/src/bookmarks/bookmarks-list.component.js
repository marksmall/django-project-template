import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Button from '../ui/button.component';
import { ReactComponent as BookmarksIcon } from './delete.svg';

import { deleteBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarkList = ({ bookmarks, selectBookmark }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.panel}>
      {bookmarks && bookmarks.length > 0 ? (
        <ul>
          {bookmarks.map(bookmark => {
            return (
              <li key={bookmark.title} className={styles.bookmark}>
                <span onClick={() => selectBookmark(bookmark)}>{bookmark.title}</span>
                <Button onClick={() => dispatch(deleteBookmark(bookmark))}>
                  <BookmarksIcon className={styles.icon} />
                </Button>
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
