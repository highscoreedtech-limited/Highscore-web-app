// lib/providers/AuthProvider.tsx
// Shared, reactive auth state backed by the Go backend (replaces Supabase).
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { authApi, session, User } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {
    throw new Error("AuthProvider missing");
  },
  logout: () => {},
  setUser: () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore the cached user, then refresh it from the backend if we
  // still hold a token (keeps streak/balance current and validates the session).
  useEffect(() => {
    const cached = session.getUser();
    if (cached) setUser(cached);

    if (session.isAuthenticated) {
      authApi
        .profile()
        .then((fresh) => setUser(fresh))
        .catch(() => {
          // token invalid/expired beyond refresh → treat as logged out
          session.clear();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const fresh = await authApi.profile();
    setUser(fresh);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, setUser, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
