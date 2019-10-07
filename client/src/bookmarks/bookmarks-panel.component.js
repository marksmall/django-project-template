import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import { fetchBookmarks, addBookmark, selectBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarksPanel = ({ map }) => {
  const dispatch = useDispatch();

  const submit = values => {
    console.log('BOOKMARK VALUES: ', values);
    const style = map.getStyle();

    const sources = Object.keys(style.sources)
      .filter(source => source.startsWith('mapbox-gl-draw'))
      .map(source => style.sources[source]);
    console.log('SOURCES: ', sources, values, map.getCenter(), map.getZoom());
    dispatch(addBookmark({ ...values, sources }));
  };

  const chooseBookmark = bookmark => {
    console.log('SELECTED BOOKMARK: ', bookmark);
    dispatch(selectBookmark(bookmark));
  };

  const bookmarks = useSelector(state => state.bookmarks.bookmarks);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks]);
  console.log('BOOKMARKS: ', bookmarks);

  return (
    <div className={styles.panel}>
      <BookmarkForm submit={submit} />
      <BookmarkList bookmarks={bookmarks} selectBookmark={chooseBookmark} />
    </div>
  );
};

export default BookmarksPanel;
