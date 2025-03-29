import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './Login';

const ProtectedRoute = ({ children }) => {
  const accessToken = new URLSearchParams(window.location.search).get('access_token');

  if (!accessToken) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute; 