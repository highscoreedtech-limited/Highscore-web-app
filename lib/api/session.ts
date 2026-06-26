// Session store — the only module that touches token persistence.
// SSR-safe (guards `window`). Keeps tokens in localStorage and mirrors a
// non-sensitive `hs_auth` cookie so middleware can gate routes.
import type { User } from "@/lib/domain/models";

const ACCESS_KEY = "hs_access_token";
const REFRESH_KEY = "hs_refresh_token";
const USER_KEY = "hs_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const session = {
  get access(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  save(access: string, refresh: string, user?: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    // UX flag for middleware; real auth is the JWT the backend requires.
    document.cookie = `hs_auth=1; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  },
  saveUser(user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = "hs_auth=; path=/; max-age=0; samesite=lax";
  },
  get isAuthenticated(): boolean {
    return !!this.access;
  },
};
