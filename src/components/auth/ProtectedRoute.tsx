// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If on an onboarding route but already onboarded, send to dashboard
  if (
    location.pathname.startsWith('/onboarding/') &&
    user?.isOnboarded
  ) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // If on an app route but not yet onboarded, send to onboarding welcome
  if (
    location.pathname.startsWith('/app/') &&
    !user?.isOnboarded
  ) {
    return <Navigate to="/onboarding/welcome" replace />;
  }

  // Otherwise render the child routes or provided children
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
