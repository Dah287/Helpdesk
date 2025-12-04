import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('user'); // ✅ sessionStorage au lieu de sessionStorage

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
