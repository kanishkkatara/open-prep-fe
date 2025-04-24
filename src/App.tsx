import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OnboardingWelcome from "./pages/onboarding/OnboardingWelcome";
import OnboardingChat from "./pages/onboarding/OnboardingChat";
import Dashboard from "./pages/dashboard/Dashboard";
import QuestionBank from "./pages/questions/QuestionBank";
import QuestionPage from "./pages/questions/QuestionPage";

import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<ProtectedRoute />}>
            <Route path="welcome" element={<OnboardingWelcome />} />
            <Route path="chat" element={<OnboardingChat />} />
          </Route>

          {/* App Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />

            {/* Question Bank (list) */}
            <Route path="questions" element={<QuestionBank />} />
            {/* Question Detail */}
            <Route path="questions/:id" element={<QuestionPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
