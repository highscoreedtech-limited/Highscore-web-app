// Network configuration — the single source of truth for backend origins.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://highscore-mobile-production.up.railway.app";

export const WS_BASE = API_BASE.replace(/^http/, "ws");
