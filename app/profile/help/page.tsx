"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Bug, HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  { q: "I paid but my subscription isn't active. What do I do?", a: "This can happen if you closed the app before the payment was verified. Reopen the app — it automatically verifies on launch. If the issue persists, contact support with your payment reference." },
  { q: "How are points and HST tokens different?", a: "You earn points by playing quizzes, keeping streaks and referring friends. You can convert points into HST tokens (50 points = 1 HST), which you redeem for real rewards in your wallet." },
  { q: "Does HighScore work offline?", a: "Your streak and some data is saved on your device, so parts work without internet. However, quiz questions, the leaderboard, and multiplayer battles need an internet connection." },
  { q: "How do I climb the leaderboard?", a: "Play more quizzes and CBT practice, keep your daily streak, and win battles. Points from these actions feed your leaderboard ranking in real time." },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back"><ArrowLeft size={16} /></button>
          <h1 className="text-lg font-bold text-white">Help & Support</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        {/* Contact card */}
        <div className="rounded-2xl border border-hs-border bg-white p-5">
          <p className="text-base font-bold text-hs-navy">Need help?</p>
          <p className="text-sm text-hs-muted">Our team usually replies within 24 hours.</p>
          <div className="mt-4 flex gap-2.5">
            <a href="mailto:support@highscore.ng" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-hs-blue py-3 text-sm font-semibold text-white">
              <Mail size={16} /> Email us
            </a>
            <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-hs-border py-3 text-sm font-semibold text-hs-navy">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-3 divide-y divide-hs-border overflow-hidden rounded-2xl border border-hs-border bg-white">
          <a href="mailto:support@highscore.ng?subject=Bug%20report" className="flex items-center gap-3 px-4 py-3.5 hover:bg-hs-bg">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-red-50 text-red-500"><Bug size={18} /></span>
            <span className="flex-1"><span className="block text-sm font-semibold text-hs-navy">Report a bug</span><span className="block text-[11px] text-hs-muted">App crash, wrong answer, or broken feature</span></span>
          </a>
          <a href="mailto:support@highscore.ng?subject=Question" className="flex items-center gap-3 px-4 py-3.5 hover:bg-hs-bg">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-hs-blueTint text-hs-blue"><HelpCircle size={18} /></span>
            <span className="flex-1"><span className="block text-sm font-semibold text-hs-navy">Ask a question</span><span className="block text-[11px] text-hs-muted">Anything we didn&apos;t cover below</span></span>
          </a>
        </div>

        {/* FAQs */}
        <p className="mt-6 text-sm font-bold text-hs-navy">Frequently asked questions</p>
        <div className="mt-3 space-y-2.5">
          {FAQS.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-hs-border bg-white">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className="flex-1 text-sm font-semibold text-hs-navy">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-hs-muted transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-hs-muted">{f.a}</p>}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-hs-muted">HighScore v1.0.0 · support@highscore.ng</p>
      </div>
    </div>
  );
}
