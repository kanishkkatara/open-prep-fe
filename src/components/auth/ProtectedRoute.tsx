import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // For onboarding paths, check if user should bypass onboarding
  if (location.pathname.startsWith('/onboarding/') && user?.isOnboarded) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  // For app paths, check if user needs onboarding
  if (location.pathname.startsWith('/app/') && !user?.isOnboarded) {
    return <Navigate to="/onboarding/welcome" replace />;
  }
  
  // Return either the children or the outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;