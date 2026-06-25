"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Download, Trash2, FileText, Shield, Scale, Eye, ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();

  const item = (Icon: any, color: string, title: string, subtitle: string, onClick: () => void, trailing?: string) => (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-hs-bg">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${color}1A`, color }}><Icon size={18} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-hs-navy">{title}</span>
        <span className="block truncate text-[11px] text-hs-muted">{subtitle}</span>
      </span>
      {trailing ? <span className="text-[11px] font-bold text-hs-blue">{trailing}</span> : <ChevronRight size={18} className="text-hs-placeholder" />}
    </button>
  );

  const confirmDelete = () => {
    if (window.confirm("Permanently delete your account and all data? This cannot be undone.")) {
      toast.info("Account deletion request submitted. Our team will process it within 48 hours.");
    }
  };

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back"><ArrowLeft size={16} /></button>
          <h1 className="text-lg font-bold text-white">Privacy</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-3 px-4 pt-5 lg:px-8">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-hs-muted">Your data</p>
        <div className="divide-y divide-hs-border overflow-hidden rounded-2xl border border-hs-border bg-white">
          {item(Download, "#185FA5", "Download my data", "Get a copy of your account data", () => toast.success("We'll email your data export shortly."))}
          {item(Trash2, "#DC2626", "Delete my account", "Permanently remove your account and data", confirmDelete)}
        </div>

        <p className="px-1 pt-2 text-xs font-bold uppercase tracking-wide text-hs-muted">Legal</p>
        <div className="divide-y divide-hs-border overflow-hidden rounded-2xl border border-hs-border bg-white">
          {item(Shield, "#059669", "Privacy Policy", "How we collect and use your data", () => toast.info("Opening Privacy Policy…"))}
          {item(FileText, "#185FA5", "Terms & Conditions", "Rules for using HighScore", () => toast.info("Opening Terms…"))}
          {item(Scale, "#7C3AED", "Data Compliance (NDPR)", "How we comply with Nigerian data law", () => toast.info("Opening NDPR notice…"))}
        </div>

        <p className="px-1 pt-2 text-xs font-bold uppercase tracking-wide text-hs-muted">Visibility</p>
        <div className="divide-y divide-hs-border overflow-hidden rounded-2xl border border-hs-border bg-white">
          {item(Eye, "#854F0B", "Leaderboard visibility", "Your name and score are visible to all users", () => {}, "Public")}
          {item(Eye, "#854F0B", "Profile visibility", "Other users can see your name and exam type", () => {}, "Public")}
        </div>
      </div>
    </div>
  );
}
