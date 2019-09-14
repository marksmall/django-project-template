import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppConfig } from './app.actions';

import styles from './app.module.css';

const App = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchAppConfig());
  //   const trackingId = useSelector(state => state.app.config.trackingId);
  //   ReactGA.initialize(trackingId);
  //   ReactGA.pageview('/', null, 'APPLICATION NAME App');
  // }, [dispatch])

  return <main className={styles.app}>WOO HOO GOT HERE</main>;
};

export default App;
