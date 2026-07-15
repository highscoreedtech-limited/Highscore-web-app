"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Mirrors the featured posts on the public blog.
const POSTS = [
  { title: "JAMB 2026: 7 study habits that actually move your score", tag: "JAMB", img: "/study-background.jpg" },
  { title: "How to master CBT practice before exam day", tag: "CBT", img: "/cbt-banner.jpg" },
  { title: "WAEC vs NECO: what really changes in your prep", tag: "WAEC", img: "/english.jpg" },
  { title: "Beat exam anxiety with quiz battles", tag: "Wellbeing", img: "/quiz.jpg" },
];

/** Auto-sliding blog/news preview on the dashboard. Click → public blog. */
export default function BlogSlider() {
  const router = useRouter();
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % POSTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const p = POSTS[i];

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-hs-navy">News & tips</p>
        <button onClick={() => router.push("/blog")} className="flex items-center gap-1 text-xs font-semibold text-hs-blue">
          See all <ArrowRight size={13} />
        </button>
      </div>
      <button onClick={() => router.push("/blog")} className="relative block h-40 w-full overflow-hidden rounded-3xl text-left sm:h-44">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={p.img} alt={p.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-hs-navy/85 via-hs-navy/20 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-hs-amber px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-hs-amberDark">{p.tag}</span>
            <p className="absolute inset-x-4 bottom-4 line-clamp-2 text-base font-extrabold leading-snug text-white sm:text-lg">{p.title}</p>
          </motion.div>
        </AnimatePresence>
        {/* Dots */}
        <div className="absolute bottom-2 right-3 flex gap-1.5">
          {POSTS.map((_, d) => (
            <span key={d} className="h-1.5 rounded-full bg-white/80 transition-all" style={{ width: d === i ? 16 : 6, opacity: d === i ? 1 : 0.5 }} />
          ))}
        </div>
      </button>
    </div>
  );
}
