"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ResetPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // ✅ OTP as array
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validEmail, setValidEmail] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);

  const slides = [{ bg: "/Union2.svg", img: "/lock.png" }];
  const currentSlide = slides[0];

  // ===== Helpers =====
  const validatePassword = (val: string) => {
    const strong =
      /[A-Z]/.test(val) &&
      /[a-z]/.test(val) &&
      /[0-9]/.test(val) &&
      /[^A-Za-z0-9]/.test(val) &&
      val.length >= 8;
    setPasswordValid(strong);
  };

  const checkConfirmPassword = (confirmValue: string, mainPassword: string) => {
    if (confirmValue === mainPassword && confirmValue.length > 0) {
      setConfirmValid(true);
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    } else {
      setConfirmValid(false);
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(value);
    setValidEmail(valid);
    setErrors(prev => ({ ...prev, email: valid ? "" : "Enter a valid email address" }));
    setEmail(value);
  };

  // ===== OTP & Email =====
  const sendOtp = async () => {
    if (isSubmitting) return; // prevent multiple clicks
    if (!validEmail || !email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email);

      toast.success("Reset code sent! Check your email.");
      setStep("otp");
      setOtp(["", "", "", ""]); // reset OTP inputs
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
      setErrors(prev => ({ ...prev, email: error?.message || "" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      toast.error("Enter the complete 4-digit OTP.");
      return;
    }

    if (!email) {
      toast.error("Email missing. Go back and enter your email.");
      setStep("email");
      return;
    }

    // The backend validates the code together with the new password in the
    // reset-password call, so here we just move on to the reset step.
    setErrors(prev => ({ ...prev, otp: "" }));
    setStep("reset");
  };

  // ===== Reset Password =====
  const resetPassword = async () => {
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }

    if (!email) {
      toast.error("Email missing. Go back and enter your email.");
      setStep("email");
      return;
    }

    if (!passwordValid) {
      toast.error("Choose a stronger password (8+ chars, upper/lower/number/symbol).");
      return;
    }
    if (!confirmValid) {
      toast.error("Passwords do not match.");
      return;
    }

    if (isSubmitting) return; // prevent double submit
    setIsSubmitting(true);

    try {
      await authApi.resetPassword(email, otp.join(""), password);

      toast.success("Password reset successfully! Redirecting to login...");
      setStep("success");

      setTimeout(() => router.push("/login"), 1500); // redirect after toast

     
      setEmail("");
      setOtp(["", "", "", ""]);
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
      setErrors(prev => ({ ...prev, password: error.message }));
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

          <h3 className="text-xl font-bold mb-1 text-center text-gray-800">
            {step === "email" ? "Forgot Password?" : step === "otp" ? "Verify OTP" : "Reset Password"}
          </h3>
          <p className="text-base text-gray-500 mb-4 text-center">
            {step === "email"
              ? "Enter your email and we'll send you a reset code."
              : step === "otp"
              ? `Enter the 4-digit code sent to ${email}`
              : "Choose a strong new password."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === "email") sendOtp();
              else if (step === "otp") handleVerifyOtp();
              else if (step === "reset") resetPassword();
            }}
            className="space-y-3 w-full"
          >
            {/* Email Step */}
            {step === "email" && (
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  className={`w-full h-10 px-4 pr-10 text-sm border-2 rounded-xl outline-none transition-all shadow-none focus:ring-0 focus-visible:ring-0 ${
                    validEmail === false ? "border-red-500" : validEmail === true ? "border-green-500" : "border-gray-300 focus:border-hs-blue"
                  }`}
                />
                {validEmail === true && <Check className="absolute right-3 top-3 text-green-500 h-5 w-5" />}
                {validEmail === false && <X className="absolute right-3 top-3 text-red-500 h-5 w-5" />}
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="w-full">
                <div className="flex justify-center gap-3 mb-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/, "");
                        setOtp(prev => {
                          const newOtp = [...prev];
                          newOtp[i] = val;
                          return newOtp;
                        });
                        if (val && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg rounded-xl border-2 border-gray-300 focus:border-hs-blue focus:outline-none bg-hs-blueTint"
                    />
                  ))}
                </div>
                {errors.otp && <p className="text-xs text-red-500 text-center mt-1">{errors.otp}</p>}
                <p className="text-center text-xs text-gray-500 mt-4">
                  Didn&apos;t receive it?{" "}
                  <button type="button" onClick={sendOtp} disabled={isSubmitting} className="text-hs-blue font-bold hover:underline disabled:opacity-50">
                    Resend code
                  </button>
                </p>
              </div>
            )}

            {/* Reset Password Step */}
            {step === "reset" && (
              <div className="space-y-4 w-full">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                    className={`w-full h-11 text-base px-4 pr-20 rounded-xl border-2 outline-none focus:border-hs-blue ${
                      passwordValid ? "border-green-500" : errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-10 top-3 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {passwordValid && <Check className="absolute right-3 top-3 text-green-500 h-5 w-5" />}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); checkConfirmPassword(e.target.value, password); }}
                    className={`w-full h-11 text-base px-4 pr-20 rounded-xl border-2 outline-none focus:border-hs-blue ${
                      confirmValid ? "border-green-500" : errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-10 top-3 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {confirmValid && <Check className="absolute right-3 top-3 text-green-500 h-5 w-5" />}
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-base font-semibold rounded-full text-white bg-hs-blue hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
            >
              {isSubmitting ? "Processing..." : step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}
            </button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Remember your password?{" "}
              <Link href="/login" className="text-hs-blue font-bold hover:underline">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
