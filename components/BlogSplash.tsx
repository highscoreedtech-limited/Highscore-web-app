"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Brief branded intro shown once when the blog opens. Displays the HERR
 * (HighScore EdTech Research Review) badge, then fades out into the page.
 * Shows once per browser session so it never nags on every navigation.
 */
export default function BlogSplash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("herr_splash_seen")) return;
    setShow(true);
    sessionStorage.setItem("herr_splash_seen", "1");
    const t = setTimeout(() => setShow(false), 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(160deg,#042C53,#06223E)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* soft radial glow */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at center, rgba(239,159,39,0.16) 0%, transparent 60%)" }} />

          <motion.img
            src="/HERR.png"
            alt="HighScore EdTech Research Review"
            className="h-40 w-40 object-contain drop-shadow-2xl sm:h-48 sm:w-48"
            initial={{ scale: 0.6, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          />

          <motion.div
            className="mt-5 h-[3px] rounded-full"
            style={{ background: "linear-gradient(90deg,#EF9F27,#FFC85C)" }}
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.35, duration: 0.55, ease: "easeInOut" }}
          />

          <motion.p
            className="mt-4 text-[12px] font-bold tracking-[3px] text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            HIGHSCORE EDTECH · BLOG
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
