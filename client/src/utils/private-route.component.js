import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, user, rest }) => (
  <Route
    {...rest}
    render={props =>
      user ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.object
};

export default PrivateRoute;
