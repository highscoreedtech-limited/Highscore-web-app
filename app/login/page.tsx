"use client";

import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", firebase: "" });
  const [validEmail, setValidEmail] = useState<boolean | null>(null);
  const [validPassword, setValidPassword] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const slides = [
    { bg: "/Union2.svg", img: "/login-pencil.png" },
    { bg: "/Union1.svg", img: "/login-book.png" },
    { bg: "/Union2.svg", img: "/star.png" },
  ];



  const [currentIndex, setCurrentIndex] = useState(0);
  const { user: currentUser, loading: authLoading, login } = useAuth();

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Redirect if already logged in (unless logging in right now)
  useEffect(() => {
    if (!authLoading && currentUser && !isSubmitting) {
      router.push("/dashboard");
    }
  }, [currentUser, authLoading, router, isSubmitting]);

  const currentSlide = slides[currentIndex];



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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validEmail || !validPassword) return;

    setIsSubmitting(true);

    try {
      await login(email, password);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirectTo);
      }, 1200); // Slight delay so user can see the toast
    } catch (error: any) {
      const msg: string = error?.message || "Login failed.";

      // Backend asks for email verification before allowing login → send them
      // to the verify screen with their email prefilled.
      if (/verif/i.test(msg) || /not.*confirm/i.test(msg)) {
        toast.error("Please verify your email to continue.");
        router.push(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }

      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* FULL-SCREEN BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/hero-students-computers.png')] bg-cover bg-center -scale-x-100" />
      <div className="absolute inset-0 bg-[#132D46]/70" />

      {/* FORM CARD — centered vertically & horizontally */}
      <div className="relative z-10 w-full max-w-[400px] mx-4">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center">
          
          {/* Logo — centered inside/above card */}
          <div className="relative w-20 h-20 mb-1">
            <Image src="/highscore-logo-final.png" alt="HighScore Logo" fill className="object-contain" priority />
          </div>

          {/* Form Header */}
          <h2 className="text-center text-xl font-bold mb-0.5 text-gray-800">
            Welcome back to <span className="text-hs-blue">Highscore</span>
          </h2>
          <h3 className="text-center text-gray-500 text-base mb-4">Log in to your account</h3>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
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

            <div className="text-left text-sm">
              <Link href="/forgot-password" className="text-gray-600">
                Forgot password? <span className="text-hs-blue hover:underline">Reset here</span>
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !validEmail || !validPassword}
              className={`w-full py-3 text-base font-semibold rounded-full transition-all text-white ${
                isSubmitting || !validEmail || !validPassword
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-hs-blue hover:opacity-90"
              }`}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-hs-blue font-bold hover:underline">Sign up</Link>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-4 leading-tight">
              By signing in you agree to our{" "}
              <Link href="#" className="text-hs-blue hover:underline">Terms</Link> and{" "}
              <Link href="#" className="text-hs-blue hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
