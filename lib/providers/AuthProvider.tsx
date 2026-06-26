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
import { realtime } from "@/lib/realtime/client";

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
    realtime.disconnect();
    authApi.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const fresh = await authApi.profile();
    setUser(fresh);
  }, []);

  // Real-time cross-device sync (Tier 3): keep ONE shared socket open for the
  // user and live-apply `profile_updated` events the backend pushes when the
  // profile changes on ANY device. If the event carries the user payload we
  // apply it instantly (no HTTP); otherwise we re-pull as a fallback.
  useEffect(() => {
    if (!user?.id) return;
    realtime.connect(user.id);
    const off = realtime.on("profile_updated", (data) => {
      if (data && typeof data === "object" && data.id) {
        const fresh = data as User;
        setUser(fresh);
        session.saveUser(fresh);
      } else {
        authApi.profile().then(setUser).catch(() => {});
      }
    });
    return () => { off(); };
  }, [user?.id]);

  // Cross-device sync (Tier 1 fallback): re-pull the profile whenever the
  // user returns to the app (tab focus / visible) or the device comes back
  // online. This makes changes made on the mobile app — avatar, streak, points,
  // subscription — show up on the PWA as soon as it's opened. Debounced so we
  // don't spam the backend on rapid focus/blur.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let last = 0;
    const MIN_GAP = 10_000; // at most once per 10s
    const maybeRefresh = () => {
      if (!session.isAuthenticated) return;
      if (document.visibilityState === "hidden") return;
      const now = Date.now();
      if (now - last < MIN_GAP) return;
      last = now;
      authApi.profile().then((fresh) => setUser(fresh)).catch(() => {});
    };
    const onVisible = () => { if (document.visibilityState === "visible") maybeRefresh(); };

    window.addEventListener("focus", maybeRefresh);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", maybeRefresh);
    return () => {
      window.removeEventListener("focus", maybeRefresh);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", maybeRefresh);
    };
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
