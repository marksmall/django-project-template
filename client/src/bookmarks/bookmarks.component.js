import React, { useState } from 'react';

import Button from '../ui/button.component';
import { ReactComponent as BookmarksIcon } from './bookmarks.svg';

import BookmarksPanel from './bookmarks-panel.component';

import styles from './bookmarks.module.css';

const Bookmarks = ({ map }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.bookmarks}>
      <Button
        shape="round"
        onClick={() => {
          setIsOpen(!isOpen);
          console.log('BOOKMARK MAP STYLE: ', map.getStyle());
        }}
      >
        <BookmarksIcon className={styles.icon} />
      </Button>

      {isOpen && <BookmarksPanel map={map} />}
    </div>
  );
};

export default Bookmarks;
