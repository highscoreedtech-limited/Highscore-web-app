"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";


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

  // 👇 Slides (same as Login)
  const slides = [
    { bg: "/hero-students-computers.png", img: "/login-pencil.png" },
    // { bg: "/Union1.svg", img: "/login-book.png" },
    // { bg: "/Union2.svg", img: "/star.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, loading: authLoading } = useAuth();

  // Rotate slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Redirect if already logged in (but not while we are signing up!)
  useEffect(() => {
    if (!authLoading && user && !isSubmitting) {
      router.push("/");
    }
  }, [user, authLoading, router, isSubmitting]);

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


  // Handle form submit to create account immediately
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail || !validPassword || !firstName || !lastName) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Create Supabase user (server-side, confirmed: true so they can log in, but verified: false in DB)
      const createRes = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Failed to create account");

      const supabaseUser = createData.user;
      if (!supabaseUser) throw new Error("Failed to retrieve user after signup");

      // 2️⃣ Insert user into Supabase profile table with email_verified: false
      const displayName = `${firstName} ${lastName}`;
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authid: supabaseUser.id,
          email: supabaseUser.email,
          username: '',
          display_name: displayName,
          email_verified: false, // ✅ Not verified yet
          rank: "Bronze",
          xp: 0,
          coins: 0,
          avatar: "🎮",
          totalMatches: 0,
          wins: 0,
          winRate: 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user in DB");
      }

      // 3️⃣ Send Verification OTP in the background
      fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(err => console.error("Background OTP send failed:", err));

      localStorage.setItem("username", firstName);

      // 4️⃣ Sign in client-side immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        console.warn("Auto sign-in failed:", signInError.message);
      }

      toast.success("Account created! Welcome to Highscore.");
      
      setTimeout(() => {
         router.push("/courses"); // Redirect to courses instead of dashboard
      }, 1500);

    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      let errorMessage = error.message || "Something went wrong.";
      if (error.message?.includes("already registered")) errorMessage = "This email is already in use.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;

    setIsSubmitting(true);

    try {
      // 1️⃣ Verify OTP
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otps: otpCode }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid OTP");

      // Removed redundant create-user and users calls as user is already created in handleSubmit

      localStorage.setItem("username", firstName);

      // 4️⃣ Automatically create user_quests for this user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const questsRes = await fetch("/api/user-quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authid: user.id }),
      });

      if (!questsRes.ok) {
        const data = await questsRes.json();
        console.error("Error creating user quests:", data);
        toast.error("Failed to create initial quests.");
      }

      localStorage.setItem("username", firstName);

      // 5️⃣ Sign in client-side so the session is active immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        // User was created — just redirect, they can log in manually
        console.warn("Auto sign-in failed:", signInError.message);
      }

      toast.success("Account created! Redirecting...");
      
      setTimeout(() => {
         router.push("/courses");
      }, 1500);

    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      
      let errorMessage = error.message || "Something went wrong.";
      if (error.message?.includes("already registered")) errorMessage = "This email is already in use.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };




  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google signup failed.");
      setIsSubmitting(false);
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

          {!otpStep && (
            <>
              {/* Google Signup Button */}
              <button
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
                className="w-full h-10 border-2 border-gray-100 rounded-xl mb-4 flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-4 w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-medium">Or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={otpStep ? handleVerifyOTP : handleSubmit} className="space-y-3 w-full">
            {!otpStep ? (
              <>
                {/* Name Inputs */}
                <div className="flex gap-3">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className="w-1/2 h-10 text-sm px-4 border-2 rounded-xl outline-none focus-visible:ring-0 focus:ring-0 shadow-none border-gray-300 focus:border-orange-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="w-1/2 h-10 text-sm px-4 border-2 rounded-xl outline-none focus-visible:ring-0 focus:ring-0 shadow-none border-gray-300 focus:border-orange-500"
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
                      validEmail === false ? "border-red-500" : validEmail === true ? "border-green-500" : "border-gray-300 focus:border-orange-500"
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
                      validPassword === false ? "border-red-500" : validPassword === true ? "border-green-500" : "border-gray-300 focus:border-orange-500"
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
                  placeholder="0000"
                  maxLength={4}
                  className="w-full h-12 text-2xl tracking-[0.75em] text-center px-4 border-2 rounded-xl border-gray-300 focus:border-orange-500 outline-none bg-orange-50"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <div className="flex justify-between items-center px-1">
                  <button type="button" onClick={() => setOtpStep(false)} className="text-xs text-gray-400 hover:text-gray-600 underline">Change Email</button>
                  <button type="button" onClick={handleSubmit} className="text-xs text-orange-500 font-bold hover:underline">Resend Code</button>
                </div>
              </div>
            )}

            {errors.firebase && <p className="text-sm text-red-500 text-center">{errors.firebase}</p>}

            <Button
              type="submit"
              className={`w-full py-3 h-12 text-base font-semibold rounded-full transition-all text-white shadow-md active:scale-[0.98] ${
                isSubmitting || (!otpStep && (!validEmail || !validPassword || !firstName || !lastName)) || (otpStep && otpCode.length < 4)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[linear-gradient(180deg,#FF9053_0%,#DB5206_100%)] hover:opacity-90"
              }`}
              disabled={isSubmitting || (!otpStep && (!validEmail || !validPassword || !firstName || !lastName)) || (otpStep && otpCode.length < 4)}
            >
              {isSubmitting ? "Processing..." : otpStep ? "Verify & Create Account" : "Submit & Send Code"}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 font-bold hover:underline">Log in</Link>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-4 leading-tight">
              By signing up you agree to our{" "}
              <Link href="#" className="text-orange-500 hover:underline">Terms</Link> and{" "}
              <Link href="#" className="text-orange-500 hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
