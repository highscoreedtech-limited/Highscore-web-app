"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "@/lib/api";

const EXAMS = ["JAMB", "WAEC", "NECO", "GCE", "Nursing"];
const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [phone, setPhone] = useState(user?.phone_number ?? "");
  const [examType, setExamType] = useState(user?.exam_type ?? "JAMB");
  const [state, setState] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) { toast.error("Name can't be empty."); return; }
    setSaving(true);
    try {
      await api("/api/user/profile", {
        method: "PUT",
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          exam_type: examType,
          ...(state ? { state } : {}),
          ...(phone.trim() ? { phone_number: phone.trim() } : {}),
        },
      });
      toast.success("Profile updated!");
      await refreshProfile().catch(() => {});
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(e?.message || "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-white">Edit profile</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        <Field label="First name"><input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Chidi" className={input} /></Field>
        <Field label="Last name"><input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Okafor" className={input} /></Field>
        <Field label="Phone number"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2348012345678" className={input} /></Field>
        <Field label="Exam type">
          <select value={examType} onChange={(e) => setExamType(e.target.value)} className={input}>
            {EXAMS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="State">
          <select value={state} onChange={(e) => setState(e.target.value)} className={input}>
            <option value="">Select your state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <button onClick={save} disabled={saving} className="mt-6 w-full rounded-full bg-hs-blue py-3.5 font-semibold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

const input = "w-full rounded-xl border border-hs-border bg-white px-4 py-3 text-sm text-hs-navy outline-none focus:border-hs-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-semibold text-hs-navy">{label}</label>
      {children}
    </div>
  );
}
