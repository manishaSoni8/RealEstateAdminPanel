import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/admin-login" replace />;
  }

  // If token exists, allow access to the route
  return children;
};

export default ProtectedRoute;
