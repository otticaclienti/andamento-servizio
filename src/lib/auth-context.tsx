'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserSession } from '@/types';
import { getSession, setSession as saveSession, clearSession } from './auth';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (session: UserSession) => void;
  logout: () => void;
  viewAsClientId: string | null;
  setViewAsClientId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  viewAsClientId: null,
  setViewAsClientId: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewAsClientId, setViewAsClientId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const login = useCallback((session: UserSession) => {
    saveSession(session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setViewAsClientId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, viewAsClientId, setViewAsClientId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
