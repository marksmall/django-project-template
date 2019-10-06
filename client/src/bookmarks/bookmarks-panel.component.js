import React from 'react';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import styles from './bookmarks-panel.module.css';

const BookmarksPanel = ({ map }) => {
  const submit = values => {
    console.log('BOOKMARK VALUES: ', values);
  };

  const bookmarks = [];

  return (
    <div className={styles.panel}>
      <BookmarkForm submit={submit} />
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
};

export default BookmarksPanel;
