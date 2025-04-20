import React, { createContext, useState, useContext, useEffect } from 'react';

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

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
}

const defaultUser: UserProfile = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
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
    style: ['visual', 'practice'],
    weeklyHours: 10,
    preferredTimes: ['evening'],
  },
};

const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
  completeOnboarding: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(defaultUser);
    localStorage.setItem('user', JSON.stringify(defaultUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { ...defaultUser, name, email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, isOnboarded: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);