import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';

import map from './map/map.reducer';

export const history = createHistory();

const rootReducer = combineReducers({
  map
});

// 1. Setup store to use middleware (thunk) to create API calls.
// 2. Add redux-logger to middleware.
const middleware = [thunk, routerMiddleware(history)];

let store;

if (process.env.NODE_ENV === 'development') {
  // 1. Add redux dev tools (development mode only).
  // 2. Create store composed of reducers and middleware.
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(connectRouter(history)(rootReducer), composeEnhancers(applyMiddleware(...middleware)));
} else {
  // 1. Create store composed of reducers and middleware.
  store = createStore(connectRouter(history)(rootReducer), applyMiddleware(...middleware));
}

export default store;
