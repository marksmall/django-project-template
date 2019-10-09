import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import { fetchBookmarks, addBookmark, selectBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarksPanel = ({ map }) => {
  const dispatch = useDispatch();

  const submit = values => {
    const style = map.getStyle();

    const mapboxDrawSource = Object.keys(style.sources)
      .filter(source => source === 'mapbox-gl-draw-cold')
      .map(source => style.sources[source])[0];
    console.log('BOOKMARK SUBMITTED: ', style, mapboxDrawSource, values, map.getCenter(), map.getZoom());
    dispatch(addBookmark({ ...values, source: mapboxDrawSource.data, center: map.getCenter(), zoom: map.getZoom() }));
  };

  const chooseBookmark = bookmark => {
    dispatch(selectBookmark(bookmark));
  };

  const bookmarks = useSelector(state => state.bookmarks.bookmarks);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks]);

  return (
    <div className={styles.panel}>
      <BookmarkForm submit={submit} />
      <BookmarkList bookmarks={bookmarks} selectBookmark={chooseBookmark} />
    </div>
  );
};

export default BookmarksPanel;
