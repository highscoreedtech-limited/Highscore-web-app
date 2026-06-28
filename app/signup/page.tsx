"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "@/lib/api";


export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", firebase: "" });
  const [validEmail, setValidEmail] = useState<boolean | null>(null);
  const [validPassword, setValidPassword] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referredBy, setReferredBy] = useState("");

  // Capture a referral code from the invite link (?ref=CODE).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setReferredBy(ref.trim().toUpperCase());
  }, []);

  // 👇 Slides (same as Login)
  const slides = [
    { bg: "/hero-students-computers.png", img: "/login-pencil.png" },
    // { bg: "/Union1.svg", img: "/login-book.png" },
    // { bg: "/Union2.svg", img: "/star.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, loading: authLoading, setUser } = useAuth();

  // Rotate slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Redirect if already logged in (but not while we are signing up!)
  useEffect(() => {
    if (!authLoading && user && !isSubmitting && !otpStep) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router, isSubmitting, otpStep]);

  const currentSlide = slides[currentIndex];

  // Validation
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(value);
    setValidEmail(valid);
    setErrors((prev) => ({ ...prev, email: valid ? "" : "Enter a valid email address" }));
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    const valid = value.length >= 6;
    setValidPassword(valid);
    setErrors((prev) => ({
      ...prev,
      password: valid ? "" : "Password must be at least 6 characters",
    }));
    setPassword(value);
  };


  // Step 1 — register on the Go backend. Backend emails an OTP; we then show
  // the verification step.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail || !validPassword || !firstName || !lastName) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        ...(referredBy ? { referred_by: referredBy } : {}),
      });

      toast.success("Account created! Check your email for the code.");
      setOtpStep(true);
    } catch (error: any) {
      let errorMessage = error?.message || "Something went wrong.";
      if (/already|exist|registered/i.test(errorMessage))
        errorMessage = "This email is already in use.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 — verify the emailed OTP. The backend returns tokens + user, so the
  // user is logged straight into the web app.
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;

    setIsSubmitting(true);

    try {
      const verifiedUser = await authApi.verifyEmail(email, otpCode);
      setUser(verifiedUser);

      toast.success("Email verified! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error: any) {
      toast.error(error?.message || "Invalid or expired code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authApi.resendOtp(email);
      toast.success("A new code has been sent to your email.");
    } catch (error: any) {
      toast.error(error?.message || "Could not resend code.");
    }
  };




  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* FULL-SCREEN BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/hero-students-computers.png')] bg-cover bg-center -scale-x-100" />
      <div className="absolute inset-0 bg-[#132D46]/70" />

      {/* FORM CARD — centered vertically & horizontally */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 my-8">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center">
          
          {/* Logo — centered inside/above card */}
          <div className="relative w-20 h-20 mb-1">
            <Image src="/highscore-logo-final.png" alt="HighScore Logo" fill className="object-contain" priority />
          </div>

          <h3 className="text-xl font-bold mb-1 text-center text-gray-800">Sign up</h3>
          <p className="text-base text-gray-500 mb-4 text-center ">
            {otpStep ? "Verification required" : "Join the Highscore community today!"}
          </p>

          {/* Form */}
          <form onSubmit={otpStep ? handleVerifyOTP : handleSubmit} className="space-y-3 w-full">
            {!otpStep ? (
              <>
                {referredBy && (
                  <div className="flex items-center gap-2 rounded-xl bg-hs-blueTint px-3 py-2 text-xs font-semibold text-hs-blue">
                    🎉 Referred by a friend — code <span className="font-extrabold">{referredBy}</span> applied
                  </div>
                )}
                {/* Name Inputs */}
                <div className="flex gap-3">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className="w-1/2 h-10 text-sm px-4 border-2 rounded-xl outline-none focus-visible:ring-0 focus:ring-0 shadow-none border-gray-300 focus:border-hs-blue"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="w-1/2 h-10 text-sm px-4 border-2 rounded-xl outline-none focus-visible:ring-0 focus:ring-0 shadow-none border-gray-300 focus:border-hs-blue"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full h-10 text-sm px-4 pr-10 border-2 rounded-xl outline-none focus-visible:ring-0 focus:ring-0 focus:border-transparent shadow-none ${
                      validEmail === false ? "border-red-500" : validEmail === true ? "border-green-500" : "border-gray-300 focus:border-hs-blue"
                    }`}
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                  />
                  {validEmail === true && <Check className="absolute right-3 top-3 text-green-500 h-5 w-5" />}
                  {validEmail === false && <X className="absolute right-3 top-3 text-red-500 h-5 w-5" />}
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`w-full h-10 text-sm px-4 pr-20 border-2 rounded-xl outline-none focus-visible:ring-0 focus:ring-0 focus:border-transparent shadow-none ${
                      validPassword === false ? "border-red-500" : validPassword === true ? "border-green-500" : "border-gray-300 focus:border-hs-blue"
                    }`}
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-10 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {validPassword === true && <Check className="absolute right-3 top-3 text-green-500 h-5 w-5" />}
                  {validPassword === false && <X className="absolute right-3 top-3 text-red-500 h-5 w-5" />}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-center text-sm">
                  Enter the 4-digit code sent to <br />
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full h-12 text-2xl tracking-[0.5em] text-center px-4 border-2 rounded-xl border-gray-300 focus:border-hs-blue outline-none bg-hs-blueTint"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
                <div className="flex justify-between items-center px-1">
                  <button type="button" onClick={() => setOtpStep(false)} className="text-xs text-gray-400 hover:text-gray-600 underline">Change Email</button>
                  <button type="button" onClick={handleResendOtp} className="text-xs text-hs-blue font-bold hover:underline">Resend Code</button>
                </div>
              </div>
            )}

            {errors.firebase && <p className="text-sm text-red-500 text-center">{errors.firebase}</p>}

            <Button
              type="submit"
              className={`w-full py-3 h-12 text-base font-semibold rounded-full transition-all text-white shadow-md active:scale-[0.98] ${
                isSubmitting || (!otpStep && (!validEmail || !validPassword || !firstName || !lastName)) || (otpStep && otpCode.length < 6)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-hs-blue hover:opacity-90"
              }`}
              disabled={isSubmitting || (!otpStep && (!validEmail || !validPassword || !firstName || !lastName)) || (otpStep && otpCode.length < 6)}
            >
              {isSubmitting ? "Processing..." : otpStep ? "Verify & Create Account" : "Submit & Send Code"}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-hs-blue font-bold hover:underline">Log in</Link>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-4 leading-tight">
              By signing up you agree to our{" "}
              <Link href="#" className="text-hs-blue hover:underline">Terms</Link> and{" "}
              <Link href="#" className="text-hs-blue hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
