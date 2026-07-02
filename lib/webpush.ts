// PWA web push: register the service worker, subscribe the browser with our
// VAPID key, and send the subscription to the backend. Safe to call after login;
// it no-ops when unsupported or already denied.
import { api } from "@/lib/api";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function enableWebPush(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;

  try {
    // Only prompt when the user hasn't already decided.
    if (Notification.permission === "default") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;
    } else if (Notification.permission !== "granted") {
      return;
    }

    const key = await api<{ public_key: string }>("/api/webpush/vapid-key").then((d) => d?.public_key);
    if (!key) return; // web push not configured on the backend

    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    const sub =
      existing ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      }));

    await api("/api/webpush/subscribe", { method: "POST", body: sub.toJSON() });
  } catch {
    /* unsupported / denied / offline: ignore */
  }
}
