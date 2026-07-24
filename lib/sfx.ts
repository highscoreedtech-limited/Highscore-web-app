// Lightweight sound-effects player for the quiz battle. Preloads the short
// clips and plays them on demand. Browsers block audio until the first user
// gesture — `unlock()` primes playback on the first tap so later sounds fire.
const FILES = ["correct", "combo", "wrong", "timeout", "countdown_tick", "countdown_go", "streak"] as const;
type Sfx = (typeof FILES)[number];

let cache: Partial<Record<Sfx, HTMLAudioElement>> = {};
let unlocked = false;

function el(name: Sfx): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!cache[name]) {
    const a = new Audio(`/sounds/${name}.wav`);
    a.preload = "auto";
    a.volume = 0.7;
    cache[name] = a;
  }
  return cache[name]!;
}

/** Call once on the first user interaction (e.g. Play button) to satisfy autoplay policies. */
export function unlockSfx() {
  if (unlocked || typeof window === "undefined") return;
  unlocked = true;
  for (const f of FILES) {
    const a = el(f);
    if (!a) continue;
    // A muted no-op play/pause primes the element so future plays are allowed.
    a.muted = true;
    a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; });
  }
}

export function playSfx(name: Sfx) {
  const a = el(name);
  if (!a) return;
  try {
    a.currentTime = 0;
    void a.play();
  } catch { /* ignore */ }
}
