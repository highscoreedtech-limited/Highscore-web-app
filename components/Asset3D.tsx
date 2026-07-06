"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * A pre-rendered 3D icon from /public/3d/<name>.png. Falls back to an emoji until
 * the real art is added, so the UI never breaks. Shares the SAME art files as the
 * mobile app (assets/3d) — drop identical PNGs into public/3d/. Floats gently.
 */
export default function Asset3D({
  name,
  fallback,
  size = 96,
  float = true,
}: {
  name: string;
  fallback: string;
  size?: number;
  float?: boolean;
}) {
  const [err, setErr] = useState(false);

  const fallbackNode =
    name.startsWith("gift") ? <GiftBox size={size} /> : (
      <span style={{ fontSize: size * 0.7, lineHeight: 1 }}>{fallback}</span>
    );

  const content = err ? (
    fallbackNode
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/3d/${name}.png`}
      alt=""
      onError={() => setErr(true)}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );

  if (!float) return content;
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {content}
    </motion.div>
  );
}

/** A lightweight 3D-ish gift-box placeholder (blue + gold) until real art lands. */
function GiftBox({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g3d-box" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="g3d-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="g3d-rib" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* box body */}
      <rect x="24" y="46" width="52" height="42" rx="6" fill="url(#g3d-box)" />
      {/* lid */}
      <rect x="19" y="36" width="62" height="16" rx="5" fill="url(#g3d-lid)" />
      {/* vertical ribbon */}
      <rect x="45" y="36" width="10" height="52" fill="url(#g3d-rib)" />
      {/* bow loops */}
      <path d="M50 36 C34 20 20 24 26 34 C30 41 44 38 50 36 Z" fill="url(#g3d-rib)" />
      <path d="M50 36 C66 20 80 24 74 34 C70 41 56 38 50 36 Z" fill="url(#g3d-rib)" />
      <circle cx="50" cy="35" r="6" fill="#FBBF24" />
    </svg>
  );
}
