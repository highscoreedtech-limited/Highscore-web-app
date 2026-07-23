"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Obvious "Install the app" popup. On Chrome/Edge/Android it captures the
 * native beforeinstallprompt and triggers the real install dialog. On iOS
 * Safari (no such event) it shows Add-to-Home-Screen instructions. Hidden when
 * already installed (standalone) or recently dismissed.
 */
export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already running as an installed app? Never show.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Respect a recent dismissal (7 days).
    const snoozed = Number(localStorage.getItem("pwa_prompt_snoozed") || 0);
    if (snoozed && Date.now() - snoozed < 7 * 24 * 60 * 60 * 1000) return;

    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      !/crios|fxios/i.test(window.navigator.userAgent); // Safari only
    setIsIOS(ios);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS never fires the event — show the manual card after a short delay.
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (ios) iosTimer = setTimeout(() => setShow(true), 2500);

    // Fallback: if the event hasn't fired but the browser might still support
    // installation (some desktop Chrome cases), surface the card anyway.
    const fallback = setTimeout(() => setShow(true), 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (iosTimer) clearTimeout(iosTimer);
      clearTimeout(fallback);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("pwa_prompt_snoozed", String(Date.now()));
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setShow(false);
    else dismiss();
    setDeferred(null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="animate-[hs-slideup_.4s_ease] w-full max-w-md overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_20px_60px_-12px_rgba(4,44,83,0.45)]">
        <div className="flex items-center gap-3 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="HighScore" className="h-12 w-12 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-hs-navy">Install HighScore EdTech</p>
            <p className="text-[12px] leading-snug text-hs-muted">
              {isIOS
                ? "Tap the Share button, then “Add to Home Screen” for the full app."
                : "Get the app on your home screen — faster, full-screen, works offline."}
            </p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-hs-border p-3">
          <button onClick={dismiss}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-hs-muted hover:bg-hs-bg">
            Not now
          </button>
          {!isIOS && (
            <button onClick={install}
              className="flex-[1.4] rounded-xl bg-hs-navy px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90">
              Install app
            </button>
          )}
          {isIOS && (
            <button onClick={dismiss}
              className="flex-[1.4] rounded-xl bg-hs-navy px-4 py-2.5 text-sm font-bold text-white">
              Got it
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes hs-slideup { from { transform: translateY(120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
