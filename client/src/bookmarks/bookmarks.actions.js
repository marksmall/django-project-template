import { NotificationManager } from 'react-notifications';
import { sendData, JSON_HEADERS } from '../utils/http';

import DATA from './data.json';
import DATA1 from './data1.json';

export const FETCH_BOOKMARKS_SUCCESS = 'FETCH_BOOKMARKS_SUCCESS';
export const FETCH_BOOKMARKS_FAILURE = 'FETCH_BOOKMARKS_FAILURE';

export const ADD_BOOKMARK_SUCCESS = 'ADD_BOOKMARK_SUCCESS';
export const ADD_BOOKMARK_FAILURE = 'ADD_BOOKMARK_FAILURE';

export const SELECT_BOOKMARK = 'SELECT_BOOKMARK';

const API = {
  fetch: '/api/bookmarks',
  add: '/api/bookmark/'
};

export const fetchBookmarks = () => async dispatch => {
  // const response = await fetch(API.fetch, { credentials: 'include' });

  // if (!response.ok) {
  //   const error = new Error();
  //   error.message = response.statusText;

  //   NotificationManager.error(error.message, `Fetching Bookmarks Error - ${response.statusText}`, 50000, () => {});

  //   return dispatch({
  //     type: FETCH_BOOKMARKS_FAILURE,
  //     error
  //   });
  // }

  // const bookmarks = await response.json();
  const bookmarks = [DATA, DATA1];

  return dispatch({ type: FETCH_BOOKMARKS_SUCCESS, bookmarks });
};

export const addBookmark = bookmark => async dispatch => {
  const response = await sendData(API.add, bookmark, JSON_HEADERS);

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(error.message, `Adding Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: ADD_BOOKMARK_FAILURE,
      error
    });
  } else {
    NotificationManager.success('Successfully bookmarked map', 'Successful map bookmaring', 5000, () => {});

    return dispatch({
      type: ADD_BOOKMARK_SUCCESS,
      bookmark
    });
  }
};

export const selectBookmark = bookmark => ({ type: SELECT_BOOKMARK, bookmark });

const errorResponseToString = response => {
  // Reduce all field errors to a single string representation.
  const errorStr = Object.keys(response).reduce((acc, key) => {
    const fieldErrors = response[key];

    if (Array.isArray(fieldErrors)) {
      // Reduce array of field errors to a single string representation.
      const errors = fieldErrors.reduce((acc, error) => {
        return (acc += error + ' ');
      }, '');
      acc += `${key} - ${errors}\n`;
    } else if (typeof fieldErrors === 'string' || fieldErrors instanceof String) {
      acc += fieldErrors;
    }

    return acc;
  }, '');

  return errorStr;
};
