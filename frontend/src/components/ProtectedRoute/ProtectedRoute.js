import React from 'react';
import { Navigate as NavRedirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NavRedirect to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
