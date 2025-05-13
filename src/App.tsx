// src/App.tsx

import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import OnboardingWelcome from "./pages/onboarding/OnboardingWelcome";
import OnboardingChat from "./pages/onboarding/OnboardingChat";

import Dashboard from "./pages/dashboard/Dashboard";
import QuestionBank from "./pages/questions/QuestionBank";
import QuestionPage from "./pages/questions/QuestionPage";
import EditAndPreviewQuestionPage from "./pages/questions/QuestionUpdate";

import SettingsPage from "./pages/settings/SettingsPage";
import ResourcesPage from "./pages/resources/ResourcesPage";

import PricingPage from "./pages/payment/Pricing";
import CheckoutPage from "./pages/payment/CheckoutPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";
import SubscriberRoute from "./components/auth/SubscriberRoute";
import LoadingScreen from "./components/ui/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID is not set in .env.local");
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <Toaster
        position="top-right"
        toastOptions={{ style: { zIndex: 9999, pointerEvents: "auto" } }}
      />

      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Authentication */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Onboarding: must be logged in but not yet onboarded */}
        <Route path="/onboarding" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path="welcome" element={<OnboardingWelcome />} />
          <Route path="chat" element={<OnboardingChat />} />
        </Route>

        {/* Main App: must be logged in */}
        <Route path="/app" element={<AuthenticatedRoute />}>
            {/* Public billing flows: anyone logged in */}
            <Route path="pricing" element={<PricingPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          <Route element={<AppLayout />}>

            {/* Subscriber-only pages: must have active/trial subscription */}
            <Route element={<SubscriberRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="questions" element={<QuestionBank />} />
              <Route
                path="questions/update"
                element={<EditAndPreviewQuestionPage />}
              />
              <Route path="questions/:id" element={<QuestionPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="resources" element={<ResourcesPage />} />
            </Route>

            {/* Fallback under /app */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
