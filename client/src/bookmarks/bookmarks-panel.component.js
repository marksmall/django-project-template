import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import { fetchBookmarks, addBookmark, selectBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarksPanel = ({ map }) => {
  const dispatch = useDispatch();

  const submit = form => {
    const drawCtrl = map._controls.find(ctrl => ctrl.changeMode);
    const featureCollection = drawCtrl.getAll();
    // Strip `user_` from feature properties as this is added again, when re-loaded.
    featureCollection.features = featureCollection.features.map(feature => {
      const properties = {
        ...Object.keys(feature.properties).map(key => ({ [key.replace('user_', '')]: feature.properties[key] }))
      };
      feature.properties = properties;
      return feature;
    });

    dispatch(addBookmark({ ...form, source: featureCollection, center: map.getCenter(), zoom: map.getZoom() }));
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
