"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();

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
  const { user: currentUser, loading: authLoading } = useAuth();

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
      router.push("/");
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
    setErrors((prev) => ({ ...prev, firebase: "" }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("No user found after login");

      localStorage.setItem("supabaseUid", user.id);
      
      // Store username for the dashboard
      const username = user.user_metadata?.display_name || email.split("@")[0];
      localStorage.setItem("username", username);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500); // Slight delay so user can see the toast
    } catch (error: any) {
      let errorMessage = error.message || "Login failed.";

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password.";
      }

      console.log(errorMessage);




      toast.error(errorMessage); // 🔥 Replace inline error with toast
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleGoogleLogin = async () => {
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
      toast.error(error.message || "Google login failed.");
      setIsSubmitting(false);
    }
  };  return (
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
            Welcome back to <span className="text-orange-500">Highscore</span>
          </h2>
          <h3 className="text-center text-gray-500 text-base mb-4">Log in to your account</h3>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
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

            <div className="text-left text-sm">
              <Link href="/forgot-password" className="text-gray-600">
                Forgot password? <span className="text-orange-500 hover:underline">Reset here</span>
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !validEmail || !validPassword}
              className={`w-full py-3 text-base font-semibold rounded-full transition-all text-white ${
                isSubmitting || !validEmail || !validPassword
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[linear-gradient(180deg,#FF9053_0%,#DB5206_100%)] hover:opacity-90"
              }`}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-orange-500 font-bold hover:underline">Sign up</Link>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-4 leading-tight">
              By signing in you agree to our{" "}
              <Link href="#" className="text-orange-500 hover:underline">Terms</Link> and{" "}
              <Link href="#" className="text-orange-500 hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
