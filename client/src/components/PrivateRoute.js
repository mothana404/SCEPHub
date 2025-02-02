// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const { accessToken } = useSelector((state) => state.auth);
  return accessToken ? children : <Navigate to="/SignIn" />;
}

export default PrivateRoute;
