// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const JWT_KEY = "cardioia_token";
const USER_KEY = "cardioia_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // restore from localStorage
    const token = localStorage.getItem(JWT_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  async function login(email: string, _password: string) {
    setLoading(true);
    // Simula validação: qualquer email/senha => token fake
    const fakeToken = "fake-jwt-token-" + Math.random().toString(36).slice(2);
    const fakeUser = { name: "Dr. Usuário", email };
    localStorage.setItem(JWT_KEY, fakeToken);
    localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
    setUser(fakeUser);
    setLoading(false);
    return;
  }

  function logout() {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
