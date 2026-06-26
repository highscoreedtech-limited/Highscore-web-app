"use client";

import { useEffect } from "react";

// Registers the service worker (installable + offline fallback) and reloads the
// page once when an updated worker takes control, so users always get the
// latest worker/assets without a manual hard refresh.
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Proactively check for an updated worker on load.
        reg.update().catch(() => {});
      }).catch(() => {});
    };

    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return null;
}
