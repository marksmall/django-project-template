import {
  FETCH_BOOKMARKS_SUCCESS,
  FETCH_BOOKMARKS_FAILURE,
  ADD_BOOKMARK_SUCCESS,
  ADD_BOOKMARK_FAILURE,
  SELECT_BOOKMARK
} from './bookmarks.actions';

const initialState = {
  bookmarks: null,
  selectedBookmark: null,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKMARKS_SUCCESS:
      return {
        ...state,
        bookmarks: action.bookmarks,
        error: null
      };

    case FETCH_BOOKMARKS_FAILURE:
      return { ...state, error: action.error };

    case ADD_BOOKMARK_SUCCESS:
      const bookmarks = [...state.bookmarks, action.bookmark];
      return {
        ...state,
        bookmarks,
        selectedBookmark: action.bookmark,
        error: null
      };

    case ADD_BOOKMARK_FAILURE:
      return { ...state, error: action.error };

    case SELECT_BOOKMARK:
      return { ...state, selectedBookmark: action.bookmark };

    default:
      return state;
  }
};

export default reducer;
