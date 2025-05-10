// src/components/auth/AuthenticatedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export const AuthenticatedRoute: React.FC = () => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
export default AuthenticatedRoute;
