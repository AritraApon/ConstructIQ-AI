"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { authClient } from "@/lib/auth-client"; // তোমার দেওয়া ক্লায়েন্ট ইমপোর্ট
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false); // ডেমো লগইনের জন্য নতুন স্টেট

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      toast.success("Redirecting to Google...");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in with Google.");
      setIsGoogleSubmitting(false);
    }
  };

  // Email Sign-In Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/",
    }, {
      onRequest: () => {
        setIsSubmitting(true);
      },
      onSuccess: () => {
        setIsSubmitting(false);
        setIsDemoSubmitting(false);
        toast.success("Login Successful! Redirecting...");
        router.push("/");
      },
      onError: (ctx) => {
        setIsSubmitting(false);
        setIsDemoSubmitting(false);
        toast.error(ctx.error.message || "Invalid email or password.");
      },
    });
  };

  // 🌟 Demo Login Handler (আগের কোডে কোনো ইমপ্যাক্ট ফেলবে না)
  const handleDemoLogin = async () => {
    setIsDemoSubmitting(true);

    // স্টেটে ডেমো ক্রেডেনশিয়াল সেট করা হচ্ছে ভিজ্যুয়াল ফিডব্যাকের জন্য
    const demoEmail = "d@d.com";
    const demoPassword = "D12345678";

    setEmail(demoEmail);
    setPassword(demoPassword);

    await authClient.signIn.email({
      email: demoEmail,
      password: demoPassword,
      rememberMe: false,
      callbackURL: "/",
    }, {
      onRequest: () => {
        setIsDemoSubmitting(true);
      },
      onSuccess: () => {
        setIsDemoSubmitting(false);
        toast.success("Logged in with Demo Account!");
        router.push("/");
      },
      onError: (ctx) => {
        setIsDemoSubmitting(false);
        toast.error(ctx.error.message || "Demo login failed.");
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />

      {/* Premium Glassmorphic Card */}
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-emerald-500/10 bg-[#0F172A]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-3xl">
            Welcome Back
          </h2>
          <p className="mt-1 text-xs text-[#F8FAFC]/60 sm:text-sm">
            Sign in to your Construct<span className="text-[#10B981] font-semibold">IQ</span> account
          </p>
        </div>

        {/* Action Buttons (Google & Demo) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting || isDemoSubmitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#10B981]/15 bg-[#020617]/40 py-2.5 text-xs font-semibold text-[#F8FAFC] transition-all duration-200 hover:bg-[#020617]/80 disabled:opacity-50"
          >
            {isGoogleSubmitting ? (
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.37 3.65 1.39 7.5l3.85 2.99c.92-2.75 3.48-4.45 6.76-4.45z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.52z"/>
                <path fill="#FBBC05" d="M5.24 10.49c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.5C.5 9.3.01 11.33.01 13.5s.49 4.2 1.38 6l3.85-3.01c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-4.3 1.08-3.28 0-5.84-1.7-6.76-4.45L1.39 16.86C3.37 20.35 7.35 23 12 23z"/>
              </svg>
            )}
            Google
          </button>

          {/* 🌟 New Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isGoogleSubmitting || isSubmitting || isDemoSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 py-2.5 text-xs font-semibold text-sky-400 transition-all duration-200 hover:bg-sky-500/20 disabled:opacity-50"
          >
            {isDemoSubmitting ? (
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h3a3 3 0 013 3v1" />
              </svg>
            )}
            Demo Login
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-[#10B981]/10"></div>
          <span className="mx-4 flex-shrink text-xs text-[#F8FAFC]/30 uppercase tracking-wider">Or credentials</span>
          <div className="flex-grow border-t border-[#10B981]/10"></div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email Input */}
          <div>
            <label className="text-xs font-medium text-[#F8FAFC]/80">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[#10B981]/15 bg-[#020617]/50 px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-600 transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              placeholder="name@domain.com"
            />
          </div>

          {/* Password Input with Show/Hide */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-[#F8FAFC]/80">Password</label>
              <Link href="/register" className="text-[11px] text-[#38BDF8] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-[#10B981]/15 bg-[#020617]/50 pl-3 pr-8 py-2 text-sm text-[#F8FAFC] placeholder-slate-600 transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#F8FAFC]/40 hover:text-[#10B981]"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#10B981]/25 bg-[#020617] text-[#10B981] focus:ring-[#10B981]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-[#F8FAFC]/60">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting || isDemoSubmitting}
              className="flex w-full justify-center rounded-lg bg-[#10B981] py-2 text-sm font-bold text-[#020617] transition-all duration-200 hover:bg-[#10B981]/90 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Redirect to Register */}
        <div className="text-center">
          <p className="text-xs text-[#F8FAFC]/60">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#38BDF8] hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}