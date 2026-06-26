// HTTP client — the single gateway to the Go backend.
// Responsibilities: attach bearer token, unwrap the { data } envelope, surface
// { message } errors as ApiError, and auto-refresh on 401 (single-flight).
import { API_BASE } from "./config";
import { Endpoints } from "./endpoints";
import { session } from "./session";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Backend wraps success as { data: ... } and errors as { message: ... }.
async function parse<T>(res: Response): Promise<T> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* empty / non-JSON body */
  }
  if (!res.ok) {
    const b = body as { message?: string; error?: string } | null;
    const msg = (b && (b.message || b.error)) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  const b = body as { data?: T } | null;
  return (b && "data" in b ? (b.data as T) : (body as T));
}

// Single-flight refresh: concurrent 401s share ONE refresh call.
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = session.refresh;
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}${Endpoints.auth.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const data = body?.data ?? body;
    if (!data?.access_token || !data?.refresh_token) return null;
    session.save(data.access_token, data.refresh_token);
    return data.access_token as string;
  } catch {
    // Transient failure — keep tokens so the user can retry.
    return null;
  }
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean; // attach bearer token (default true)
  _retried?: boolean;
}

/** Core request wrapper used by every service. */
export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
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
    if (newToken) return api<T>(path, { ...opts, _retried: true });
  }

  return parse<T>(res);
}
