"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !token) {
      setError("Invalid verification link.");
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otps: token }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          toast.success("Email verified successfully!");
          setTimeout(() => {
            router.push("/courses");
          }, 2000);
        } else {
          setError(data.error || "Verification failed. The link may be expired.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [email, token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Email Verification</h1>
        
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600">Verifying your email address...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
              <Check className="w-8 h-8" /> 
            </div>
            <p className="text-green-600 font-medium">Email verified successfully!</p>
            <p className="text-slate-500 text-sm">Redirecting to courses...</p>
          </div>
        )}
      </div>
    </div>
  );
}
