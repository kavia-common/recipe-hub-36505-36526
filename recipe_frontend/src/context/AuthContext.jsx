import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** This is a public context with user, token, and auth actions. */
  user: null,
  token: null,
  login: async (_u, _p) => {},
  logout: () => {},
  register: async (_u, _e, _p) => {},
  refreshMe: async () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state to the app. Persists JWT in localStorage,
   * fetches current user from /users/me if available (stub-safe).
   */
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Persist token
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoaded(true);
        return;
      }
      try {
        const me = await api.me();
        setUser(me);
      } catch {
        // token invalid or endpoint unavailable
        setUser(null);
      } finally {
        setLoaded(true);
      }
    }
    bootstrap();
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    login: async (username, password) => {
      const data = await api.login(username, password);
      // Accept token from typical FastAPI JWT payloads: access_token or token
      const nextToken = data?.access_token || data?.token;
      if (!nextToken) throw new Error('Login failed: token not provided.');
      setToken(nextToken);
      try {
        const me = await api.me();
        setUser(me);
      } catch {
        setUser(null);
      }
      return true;
    },
    logout: () => {
      setToken(null);
      setUser(null);
    },
    register: async (username, email, password) => {
      await api.register(username, email, password);
      // After register, auto-login if backend returns token
      try {
        const loginRes = await api.login(username, password);
        const t = loginRes?.access_token || loginRes?.token;
        if (t) setToken(t);
      } catch { /* no-op */ }
      return true;
    },
    refreshMe: async () => {
      try {
        const me = await api.me();
        setUser(me);
      } catch {
        setUser(null);
      }
    },
  }), [user, token]);

  if (!loaded) return <div className="container" style={{ padding: 24 }}><p className="muted">Loading...</p></div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication context. */
  return useContext(AuthContext);
}
