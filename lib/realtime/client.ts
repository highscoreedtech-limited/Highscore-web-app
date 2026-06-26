// Single, shared realtime connection for the whole tab.
//
// Best practice at scale: ONE WebSocket per user per tab, multiplexed via a
// typed pub/sub bus — never one socket per feature. Features subscribe to the
// event types they care about (profile_updated, challenge_accepted, …).
//
// Resilience: auto-reconnect with exponential backoff + jitter (capped),
// heartbeat to survive idle proxies (Railway/Cloudflare), reconnect on
// network-online, and a clean teardown on logout.
import { presenceWsUrl } from "@/lib/api/realtime";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (data: any) => void;

const MAX_BACKOFF = 30_000;
const HEARTBEAT_MS = 25_000;

class RealtimeClient {
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private handlers = new Map<string, Set<Handler>>();
  private attempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private alive = false; // we intend to stay connected

  /** Open (or keep) the shared connection for this user. Idempotent. */
  connect(userId: string) {
    if (typeof window === "undefined" || !("WebSocket" in window)) return;
    if (this.userId === userId && (this.isOpen() || this.isConnecting())) return;
    if (this.userId && this.userId !== userId) this.teardown();
    this.userId = userId;
    this.alive = true;
    window.removeEventListener("online", this.onOnline);
    window.addEventListener("online", this.onOnline);
    this.open();
  }

  /** Subscribe to an event type. Returns an unsubscribe fn. */
  on(type: string, handler: Handler): () => void {
    let set = this.handlers.get(type);
    if (!set) { set = new Set(); this.handlers.set(type, set); }
    set.add(handler);
    return () => { set!.delete(handler); };
  }

  /** Send a JSON message (used for app-level pings / future actions). */
  send(obj: unknown) {
    if (this.isOpen()) { try { this.ws!.send(JSON.stringify(obj)); } catch { /* noop */ } }
  }

  /** Fully close and stop reconnecting (call on logout). */
  disconnect() {
    this.alive = false;
    if (typeof window !== "undefined") window.removeEventListener("online", this.onOnline);
    this.teardown();
    this.userId = null;
  }

  // ── internals ───────────────────────────────────────────────────────────────
  private onOnline = () => { if (this.alive && !this.isOpen()) this.open(); };

  private open() {
    if (!this.userId || !this.alive || this.isOpen() || this.isConnecting()) return;
    try {
      const ws = new WebSocket(presenceWsUrl(this.userId));
      this.ws = ws;
      ws.onopen = () => { this.attempts = 0; this.startHeartbeat(); };
      ws.onmessage = (ev) => this.dispatch(ev.data);
      ws.onclose = () => { this.stopHeartbeat(); if (this.alive) this.scheduleReconnect(); };
      ws.onerror = () => { try { ws.close(); } catch { /* noop */ } };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.alive || this.reconnectTimer) return;
    const delay = Math.min(MAX_BACKOFF, 1000 * 2 ** this.attempts) + Math.random() * 1000;
    this.attempts += 1;
    this.reconnectTimer = setTimeout(() => { this.reconnectTimer = null; this.open(); }, delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => this.send({ type: "ping" }), HEARTBEAT_MS);
  }
  private stopHeartbeat() {
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
  }

  private dispatch(raw: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let msg: any;
    try { msg = JSON.parse(raw); } catch { return; }
    const type = msg?.type;
    if (!type || type === "pong") return;
    const data = msg.data ?? msg;
    this.handlers.get(type)?.forEach((h) => { try { h(data); } catch { /* listener error */ } });
    this.handlers.get("*")?.forEach((h) => { try { h(msg); } catch { /* listener error */ } });
  }

  private teardown() {
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    this.stopHeartbeat();
    if (this.ws) {
      try { this.ws.onclose = null; this.ws.close(); } catch { /* noop */ }
      this.ws = null;
    }
    this.attempts = 0;
  }

  private isOpen() { return this.ws?.readyState === WebSocket.OPEN; }
  private isConnecting() { return this.ws?.readyState === WebSocket.CONNECTING; }
}

// Module-level singleton: exactly one connection per tab.
export const realtime = new RealtimeClient();
