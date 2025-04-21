// src/context/UserContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

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

// A mock default user; fill in whatever makes sense for your app
const defaultUser: UserProfile = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  isOnboarded: false,
  targetScore: 700,
  examDate: null,
  previousScore: null,
  confidenceRatings: {
    quantitative: 3,
    verbal: 2,
    integrated: 3,
    analytical: 4,
  },
  learningPreferences: {
    style: ["visual", "practice"],
    weeklyHours: 10,
    preferredTimes: ["evening"],
  },
};

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  registerWithGoogle: (credential: string) => Promise<void>;
}

// Provide full defaults so createContext is happy
const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
  completeOnboarding: () => {},
  registerWithGoogle: async () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, password: string) => {
    // your real API call here
    await new Promise((r) => setTimeout(r, 1000));
    setUser(defaultUser);
    localStorage.setItem("user", JSON.stringify(defaultUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // your real API call here
    await new Promise((r) => setTimeout(r, 1000));
    const newUser = { ...defaultUser, name, email };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const completeOnboarding = () => {
    if (!user) return;
    const updated = { ...user, isOnboarded: true };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const registerWithGoogle = async (credential: string) => {
    try {
      // ✅ backticks around the URL!
      const resp = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`
      );
      if (!resp.ok) throw new Error("Google signup failed");
      const data = await resp.json();
      const newUser: UserProfile = {
        ...defaultUser,
        id: data.sub,
        name: data.name,
        email: data.email,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      console.error("Google signup error", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        registerWithGoogle, // make sure this line is here
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
