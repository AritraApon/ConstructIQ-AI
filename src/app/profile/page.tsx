"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // আপনার Better Auth ক্লায়েন্ট পাথ
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // React Toastify
import { getProjects } from "@/lib/core/server";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const [projectCount, setProjectCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // মোডাল ফর্ম স্টেট
  const [newName, setNewName] = useState("");
 const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ইউজার প্রজেক্ট কাউন্ট লোড করা
  useEffect(() => {
    if (session?.user) {
      setNewName(session.user.name || "");
      setImagePreview(session.user.image || "");

      const fetchCount = async () => {
        try {
          const response = await getProjects();
          if (response?.success && Array.isArray(response.data)) {
            const myCount = response.data.filter((p : {userId: string}) => p.userId === session.user.id).length;
            setProjectCount(myCount);
          }
        } catch (err) {
          console.error("Failed to fetch project count:", err);
        }
      };
      fetchCount();
    }
  }, [session]);


  const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgbb = async (file : File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("Imgbb API Key missing in environment variables!");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.data.url;
      }
      return null;
    } catch (err) {
      console.error("Imgbb Upload Error:", err);
      return null;
    }
  };

  // প্রোফাইল আপডেট (Better Auth - updateUser মেথড দিয়ে)
  const handleProfileUpdate = async (e : React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Identity Name fields cannot be empty!");

    setIsUpdating(true);
    let finalImageUrl = imagePreview;

    try {
      // যদি নতুন ছবি সিলেক্ট করা থাকে, তবে Imgbb তে আপলোড হবে
      if (imageFile) {
        const uploadedUrl = await uploadToImgbb(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          toast.error("Image upload failed to Imgbb.");
          setIsUpdating(false);
          return;
        }
      }

      // আপনার প্রজেক্টের স্টাইলে Better Auth-এর updateUser মেথড কল
      const { error } = await authClient.updateUser({
        name: newName,
        image: finalImageUrl || null,
      });

      if (error) {
        toast.error(error.message || "Failed to sync updates.");
      } else {
        toast.success("Identity synchronized successfully! 🎉");
        setIsModalOpen(false);
        router.refresh(); // নতুন ডেটা পেইজে রিফ্লেক্ট করার জন্য
      }
    } catch (err) {
      console.error(err);
      toast.error("An operational error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.info("Logged out successfully.");
          router.push("/login");
        }
      }
    });
  };

  if (isAuthPending) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-[#10B981] border-r-[#10B981] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-400 mb-4">You must be logged in to view your profile.</p>
        <button onClick={() => router.push("/login")} className="bg-[#10B981] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#059669] transition">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans flex items-center justify-center relative overflow-hidden">

      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Profile Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="backdrop-blur-md bg-[#0F172A]/70 border border-slate-800/80 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative z-10"
      >
        {/* Welcome Block */}
        <div className="text-center md:text-left mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#10B981] bg-emerald-500/10 px-3 py-1 rounded-full">
            Estimator Profile
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
            Welcome Back, {session.user.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your professional credentials and structural metrics.</p>
        </div>

        <hr className="border-slate-800/60 my-6" />

        {/* Info Layout */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-700 p-1 group-hover:border-[#10B981] transition-colors duration-300 shadow-xl bg-slate-900">
              <img
                src={session.user.image || "https://api.dicebear.com/7.x/bottts/svg?seed=Aritro"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="absolute -bottom-2 -right-2 bg-[#10B981] text-white p-2 rounded-xl shadow-lg hover:bg-[#059669] transition-colors cursor-pointer border border-emerald-400/20"
              title="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/xl" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </motion.button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-wide">{session.user.name}</h3>
            <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>{session.user.email}</span>
            </p>
            <div className="inline-block font-mono text-[11px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              UID: {session.user.id}
            </div>
          </div>
        </div>

        {/* Dynamic Project Statistics Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl mb-8 flex items-center justify-between shadow-inner"
        >
          <div className="space-y-1">
            <h4 className="text-slate-400 text-sm font-medium">Total AI Estimations</h4>
            <p className="text-xs text-slate-500">Number of structural models processed by you.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {String(projectCount).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        {/* Navigation Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 10px 20px -10px rgba(16,185,129,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/items/add")}
            className="bg-[#10B981] text-white p-3.5 rounded-xl font-semibold transition-all hover:bg-[#059669] text-center cursor-pointer flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create AI Estimate
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/items/manage")}
            className="bg-slate-800 border border-slate-700 text-slate-200 p-3.5 rounded-xl font-semibold transition-all hover:bg-slate-700 hover:text-white text-center cursor-pointer flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/><path d="M14 12H3"/><polyline points="10 16 14 12 10 8"/></svg>
            Manage Estimates
          </motion.button>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ opacity: 0.9 }}
          onClick={handleLogout}
          className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl font-medium text-sm transition-all hover:bg-rose-500/20 text-center cursor-pointer mt-2"
        >
          Sign Out of Account
        </motion.button>

      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
              <h3 className="text-xl font-bold text-white mb-4">Update Profile Credentials</h3>

              {/* onSubmit মেথডটি handleProfileUpdate করা হয়েছে */}
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* Image Picker with Live Preview */}
                <div className="flex flex-col items-center space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950">
                    <img
                      src={imagePreview || "https://api.dicebear.com/7.x/bottts/svg?seed=Aritro"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-colors">
                    <span>Upload New Image via Imgbb</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Aritro Mazumder"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-colors"
                  />
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setImagePreview(session.user.image || "");
                      setImageFile(null);
                    }}
                    className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white transition-all text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}