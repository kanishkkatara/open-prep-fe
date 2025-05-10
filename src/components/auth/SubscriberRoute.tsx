// src/components/auth/SubscriberRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { useUser } from "../../context/UserContext";

export const SubscriberRoute: React.FC = () => {

  // feature‐flag to turn subscription gating on/off
  const subscriptionsEnabled =
    import.meta.env.VITE_SUBSCRIPTIONS_ENABLED === "true";

  // if flag is off, just let everyone through
  if (!subscriptionsEnabled) {
    return <Outlet />;
  }
  const { isAuthenticated } = useUser();
  const sub = useSubscription();
  const location = useLocation();

  // 1) still loading?
  if (sub === undefined) {
    return null; // or <Spinner />
  }

  // 2) not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3) no subscription/trial
  if (sub === null) {
    return <Navigate to="/app/pricing" replace />;
  }

  // 4) check expiry
  const now = new Date();
  const expires = new Date(sub.current_period_end);
  const isActive =
    (sub.status === "active" || sub.status === "trialing") &&
    expires > now;

  if (!isActive) {
    return <Navigate to="/app/pricing" replace />;
  }

  // 5) good to go
  return <Outlet />;
};

export default SubscriberRoute;
