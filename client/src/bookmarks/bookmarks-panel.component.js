import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import { fetchBookmarks, addBookmark, selectBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarksPanel = ({ map }) => {
  const dispatch = useDispatch();
  const owner = useSelector(state => state.accounts.user.id);

  const submit = form => {
    const drawCtrl = map._controls.find(ctrl => ctrl.changeMode);
    const featureCollection = drawCtrl.getAll();

    const { lng, lat } = map.getCenter();

    dispatch(
      addBookmark({ ...form, feature_collection: featureCollection, center: [lat, lng], zoom: map.getZoom(), owner })
    );
  };

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));

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
