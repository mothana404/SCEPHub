import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminPrivateRoute({ children }) {
  const { accessToken, user } = useSelector((state) => state.auth);

  // 1. Check if user is logged in
  if (!accessToken) {
    return <Navigate to="/SignIn" />;
  }

  // 2. Check if user is an Admin (role === 3 in your case)
  if (user?.role !== 3) {
    // Redirect to a "Not Authorized" page, a home page, or wherever you prefer
    return <Navigate to="/" />;
  }

  // If both checks pass, render the children (Admin-only content)
  return children;
}

export default AdminPrivateRoute;