// src/App.tsx
import React, { useEffect, useState } from "react";
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

import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";
import CheckoutForm from "./pages/payment/CheckoutForm";
import PricingPage from "./pages/payment/Pricing";

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
      <UserProvider>
        {/* <Toaster> must be mounted inside your React tree */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { zIndex: 9999, pointerEvents: "auto" },
          }}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Onboarding – user must be logged in but not onboarded */}
          <Route path="/onboarding" element={<ProtectedRoute />}>
            <Route path="welcome" element={<OnboardingWelcome />} />
            <Route path="chat" element={<OnboardingChat />} />
          </Route>

          {/* Main App – user must be onboarded */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="questions/update" element={<EditAndPreviewQuestionPage />} />
            <Route path="questions/:id" element={<QuestionPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="checkout" element={<CheckoutForm />} />
          </Route>
        </Routes>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
