// lib/api.ts
// Single place that talks to the HighScore Go backend — the SAME backend the
// mobile app uses. Mirrors lib/core/api/api_client.dart: bearer token on every
// request, auto-refresh on 401 (single-flight), typed auth calls.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://highscore-mobile-production.up.railway.app";

// ─── User shape (matches the backend UserModel) ────────────────────────────────
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  exam_type: string;
  subscription_tier: string;
  avatar_color: string;
  avatar_url: string;
  streak_count: number;
  hst_balance: number;
  referral_code?: string | null;
  referral_count: number;
  referral_points: number;
}

// ─── Token + user storage (localStorage, SSR-safe) ─────────────────────────────
const ACCESS_KEY = "hs_access_token";
const REFRESH_KEY = "hs_refresh_token";
const USER_KEY = "hs_user";

export const session = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
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
  },
  get isAuthenticated() {
    return !!this.access;
  },
};

// ─── Error type so callers can show backend messages ───────────────────────────
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// The backend wraps success as { data: ... } and errors as { message: ... }.
async function parse<T>(res: Response): Promise<T> {
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* empty/non-JSON body */
  }
  if (!res.ok) {
    const msg =
      (body && (body.message || body.error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return (body?.data ?? body) as T;
}

// ─── Single-flight refresh (concurrent 401s share one refresh) ─────────────────
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = session.refresh;
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const data = body?.data ?? body;
    if (!data?.access_token || !data?.refresh_token) return null;
    session.save(data.access_token, data.refresh_token);
    return data.access_token as string;
  } catch {
    // Transient failure — keep tokens, let the user retry.
    return null;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean; // attach bearer token (default true)
  _retried?: boolean;
}

/** Core request wrapper. Use this for every backend call. */
export async function api<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth && session.access) {
    headers["Authorization"] = `Bearer ${session.access}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token expired → refresh once, then retry the original request.
  if (res.status === 401 && auth && !opts._retried) {
    const newToken = await (refreshing ??= refreshAccessToken());
    refreshing = null;
    if (newToken) {
      return api<T>(path, { ...opts, _retried: true });
    }
  }

  return parse<T>(res);
}

// ─── Auth API (mirrors mobile AuthNotifier) ────────────────────────────────────
interface AuthData {
  user: User;
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const data = await api<AuthData>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    session.save(data.access_token, data.refresh_token, data.user);
    return data.user;
  },

  async register(input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
    referred_by?: string;
  }): Promise<void> {
    await api("/auth/register", { method: "POST", auth: false, body: input });
  },

  // verify-email returns tokens → user is logged in afterwards
  async verifyEmail(email: string, code: string): Promise<User> {
    const data = await api<AuthData>("/auth/verify-email", {
      method: "POST",
      auth: false,
      body: { email, code },
    });
    session.save(data.access_token, data.refresh_token, data.user);
    return data.user;
  },

  async resendOtp(email: string): Promise<void> {
    await api("/auth/resend-otp", { method: "POST", auth: false, body: { email } });
  },

  async forgotPassword(email: string): Promise<void> {
    await api("/auth/forgot-password", {
      method: "POST",
      auth: false,
      body: { email },
    });
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await api("/auth/reset-password", {
      method: "POST",
      auth: false,
      body: { email, code, new_password: newPassword },
    });
  },

  async profile(): Promise<User> {
    const user = await api<User>("/api/user/profile");
    session.saveUser(user);
    return user;
  },

  logout() {
    session.clear();
  },
};
