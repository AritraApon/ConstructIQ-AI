"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // তোমার দেওয়া ইমপোর্ট
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Toggle Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & Error States
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Image Selection and Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      setAvatar(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Image to imgbb
  const uploadToImgbb = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      console.error("imgbb API key is missing!");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("imgbb Upload Error:", err);
      return null;
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/" // সাইন ইন হওয়ার পর যেখানে রিডাইরেক্ট করতে চাও
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
      setIsGoogleSubmitting(false);
      toast.error(err.message || "Failed to sign in with Google.");
    }
  };

  // Submit Handler with Better Auth Integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ১. পাসওয়ার্ড ম্যাচিং চেক
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ২. পাসওয়ার্ড লেন্থ চেক
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    let uploadedImageUrl = "";

    // ৩. ইমেজ থাকলে আপলোড করা
    if (avatar) {
      setIsUploading(true);
      const imgUrl = await uploadToImgbb(avatar);
      setIsUploading(false);

      if (!imgUrl) {
        setError("Failed to upload profile picture.");
        setIsSubmitting(false);
        return;
      }
      uploadedImageUrl = imgUrl;
    }

    // ৪. Better Auth Sign-Up Trigger
    await authClient.signUp.email({
      email,
      password,
      name,
      image: uploadedImageUrl || undefined,
      callbackURL: "/"
    }, {
      onRequest: () => {
        setIsSubmitting(true);
      },
      onSuccess: () => {
        setIsSubmitting(false);
        router.push("/");
        toast.success("Account created successfully!");
      },
      onError: (ctx) => {
        setIsSubmitting(false);
        setError(ctx.error.message || "Something went wrong during sign up.");
        toast.error(ctx.error.message || "Something went wrong during sign up.");
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      {/* Premium Glassmorphic Card (Max width increased slightly to fit grid side-by-side) */}
      <div className="w-full max-w-xl space-y-5 rounded-2xl border border-emerald-500/10 bg-[#0F172A]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-3xl">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-[#F8FAFC]/60 sm:text-sm">
            Join Construct<span className="text-[#10B981] font-semibold">IQ</span> and start estimating
          </p>
        </div>

        {/* Google Sign-Up Button (Top Priority) */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#10B981]/15 bg-[#020617]/40 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:bg-[#020617]/80 disabled:opacity-50"
          >
            {isGoogleSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              // Google SVG Icon
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.37 3.65 1.39 7.5l3.85 2.99c.92-2.75 3.48-4.45 6.76-4.45z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.52z"/>
                <path fill="#FBBC05" d="M5.24 10.49c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.5C.5 9.3.01 11.33.01 13.5s.49 4.2 1.38 6l3.85-3.01c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-4.3 1.08-3.28 0-5.84-1.7-6.76-4.45L1.39 16.86C3.37 20.35 7.35 23 12 23z"/>
              </svg>
            )}
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-[#10B981]/10"></div>
          <span className="mx-4 flex-shrink text-xs text-[#F8FAFC]/30 uppercase tracking-wider">Or register manually</span>
          <div className="flex-grow border-t border-[#10B981]/10"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Avatar Upload (Super Compacted) */}
          <div className="flex items-center gap-4 rounded-xl border border-[#10B981]/10 bg-[#020617]/20 p-2.5">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-dashed border-[#10B981]/30 bg-[#020617] flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg className="h-6 w-6 text-[#F8FAFC]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                </svg>
              )}
              <label htmlFor="file-upload" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#10B981] p-1 text-[#020617] shadow-lg hover:scale-105">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F8FAFC]/80">Upload Profile Photo</p>
              <p className="text-[10px] text-[#F8FAFC]/40">Optional • Max 2MB image format</p>
            </div>
          </div>

          {/* Grid Layout to save vertical space */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Name Input */}
            <div>
              <label className="text-xs font-medium text-[#F8FAFC]/80">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-[#10B981]/15 bg-[#020617]/50 px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-600 transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                placeholder="Enter your name"
              />
            </div>

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
              <label className="text-xs font-medium text-[#F8FAFC]/80">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-[#10B981]/15 bg-[#020617]/50 pl-3 pr-8 py-2 text-sm text-[#F8FAFC] placeholder-slate-600 transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                  placeholder="Min 8 chars"
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

            {/* Confirm Password Input with Show/Hide */}
            <div>
              <label className="text-xs font-medium text-[#F8FAFC]/80">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-[#10B981]/15 bg-[#020617]/50 pl-3 pr-8 py-2 text-sm text-[#F8FAFC] placeholder-slate-600 transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#F8FAFC]/40 hover:text-[#10B981]"
                >
                  {showConfirmPassword ? (
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

          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || isUploading || isGoogleSubmitting}
              className="flex w-full justify-center rounded-lg bg-[#10B981] py-2 text-sm font-bold text-[#020617] transition-all duration-200 hover:bg-[#10B981]/90 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] disabled:opacity-50"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading Photo...
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Redirect Link */}
        <div className="text-center">
          <p className="text-xs text-[#F8FAFC]/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#38BDF8] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}