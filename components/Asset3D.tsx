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

  const content = err ? (
    <span style={{ fontSize: size * 0.7, lineHeight: 1 }}>{fallback}</span>
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
