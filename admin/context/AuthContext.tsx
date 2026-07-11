'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import api, { ApiResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Types
interface Admin {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isMounted = useRef(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (isMounted.current) setIsLoading(false);
      return;
    }

    try {
      const res = await api.get<ApiResponse<Admin>>('/auth/me');
      if (res.data.success) {
        if (isMounted.current) setAdmin(res.data.data);
      } else {
        localStorage.removeItem('token');
      }
    } catch {
      localStorage.removeItem('token');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    // Defer the check to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const res = await api.post<ApiResponse<{ admin: Admin; token: string }>>('/auth/login', {
      email,
      password,
    });
    const { admin, token } = res.data.data;
    localStorage.setItem('token', token);
    setAdmin(admin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};