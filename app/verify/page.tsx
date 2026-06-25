"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuth } from "../hooks/useAuth";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { setUser } = useAuth();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Missing email. Please sign up or log in again.");
      router.push("/signup");
      return;
    }
    if (code.length < 4) {
      toast.error("Enter the code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await authApi.verifyEmail(email, code);
      setUser(user);
      toast.success("Email verified! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (error: any) {
      toast.error(error?.message || "Invalid or expired code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendOtp(email);
      toast.success("A new code has been sent to your email.");
    } catch (error: any) {
      toast.error(error?.message || "Could not resend code.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-2">
          <Image src="/highscore-logo-final.png" alt="HighScore Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-xl font-bold mb-1 text-slate-800">Verify your email</h1>
        <p className="text-sm text-slate-500 mb-5 text-center">
          {email ? <>Enter the code we sent to <span className="font-semibold">{email}</span></> : "Enter your verification code"}
        </p>

        <form onSubmit={handleVerify} className="w-full space-y-4">
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full h-12 text-center text-lg tracking-[0.4em] rounded-xl border-2 border-gray-300 focus:border-[#185FA5] focus:outline-none bg-blue-50"
          />

          <button
            type="submit"
            disabled={isSubmitting || code.length < 4}
            className="w-full py-3 text-base font-semibold rounded-full text-white bg-[#185FA5] hover:bg-[#0C447C] disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Didn&apos;t receive it?{" "}
          <button type="button" onClick={handleResend} className="text-[#185FA5] font-bold hover:underline">
            Resend code
          </button>
        </p>
        <div className="text-center text-sm text-gray-600 pt-3">
          <Link href="/login" className="text-[#185FA5] font-bold hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto border-4 border-[#185FA5] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
