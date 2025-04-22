// src/context/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { loginWithGoogle, fetchCurrentUser } from "../lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isOnboarded: boolean;
  targetScore: number;
  examDate: Date | null;
  previousScore: number | null;
  confidenceRatings: {
    quantitative: number;
    verbal: number;
    integrated: number;
    analytical: number;
  };
  learningPreferences: {
    style: string[];
    weeklyHours: number;
    preferredTimes: string[];
  };
}

const defaultUser: UserProfile = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  isOnboarded: false,
  targetScore: 700,
  examDate: null,
  previousScore: null,
  confidenceRatings: { quantitative: 3, verbal: 2, integrated: 3, analytical: 4 },
  learningPreferences: { style: ["visual", "practice"], weeklyHours: 10, preferredTimes: ["evening"] },
};

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  registerWithGoogle: (credential: string) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  completeOnboarding: async () => {},
  registerWithGoogle: async () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser(token)
        .then((u) => {
          const mapped = mapServerUserToProfile(u);
          setUser(mapped);
          localStorage.setItem("user", JSON.stringify(mapped));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    // backward-compatible mock login
    await new Promise((r) => setTimeout(r, 1000));
    setUser(defaultUser);
    localStorage.setItem("user", JSON.stringify(defaultUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // backward-compatible mock register
    await new Promise((r) => setTimeout(r, 1000));
    const newUser = { ...defaultUser, name, email };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !token) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const completeOnboarding = async () => {
    await updateProfile({ isOnboarded: true });
  };

  const registerWithGoogle = async (credential: string) => {
    // call backend login endpoint
    const { access_token } = await loginWithGoogle(credential);
    setToken(access_token);
    localStorage.setItem("token", access_token);

    const serverUser = await fetchCurrentUser(access_token);
    const mapped = mapServerUserToProfile(serverUser);
    setUser(mapped);
    localStorage.setItem("user", JSON.stringify(mapped));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        registerWithGoogle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};

function mapServerUserToProfile(u: any): UserProfile {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    isOnboarded: u.isOnboarded ?? defaultUser.isOnboarded,
    targetScore: u.targetScore ?? defaultUser.targetScore,
    examDate: u.examDate ? new Date(u.examDate) : null,
    previousScore: u.previousScore ?? defaultUser.previousScore,
    confidenceRatings: u.confidenceRatings ?? defaultUser.confidenceRatings,
    learningPreferences: u.learningPreferences ?? defaultUser.learningPreferences,
  };
}