'use client'
// src/app/lib/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: { fullName: string } | null;
  userId: number | null;
  login: (user: { fullName: string }, userId: number) => void;
  logout: () => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ fullName: string } | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      console.log("Initial user from localStorage:", storedUser ? JSON.parse(storedUser) : null);
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [userId, setUserId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      console.log("Initial userId from localStorage:", storedUserId ? parseInt(storedUserId) : null);
      return storedUserId ? parseInt(storedUserId) : null;
    }
    return null;
  });

  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    console.log("User updated, saving to localStorage:", user);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    console.log("UserId updated, saving to localStorage:", userId);
    if (userId) localStorage.setItem("userId", userId.toString());
    else localStorage.removeItem("userId");
  }, [user, userId]);

  const login = (newUser: { fullName: string }, newUserId: number) => {
    console.log("Logging in user:", newUser, "with userId:", newUserId);
    setUser(newUser);
    setUserId(newUserId);
  };

  const logout = () => {
    console.log("Logging out user");
    setUser(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};