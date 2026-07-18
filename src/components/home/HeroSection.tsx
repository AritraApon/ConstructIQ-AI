"use client";

import type { Variants } from "framer-motion";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const slides = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1600&q=80",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 20 },
  },
} as const;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${slides[current]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020617]/80 via-[#020617]/70 to-[#020617]" />

      {/* Mesh glow blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[140px] z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-sky-400/10 blur-[140px] z-10 pointer-events-none" />

      {/* Slide indicator dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-emerald-400" : "w-2 bg-slate-600"
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants }>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            AI-Powered Construction Intelligence
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
        >
          Estimate Smarter.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
            Build Faster.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Harness machine learning to generate precise cost estimates, track
          material pipelines, and accelerate your civil engineering projects
          from blueprint to delivery.
        </motion.p>

        <motion.div
          variants={itemVariants }
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/items/add"
            className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] active:scale-95"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 transition-all duration-200 backdrop-blur-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </span>
            Watch Demo
          </button>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={itemVariants}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500"
        >
          {["No credit card required", "Free 14-day trial", "GDPR compliant"].map(
            (t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> {t}
              </span>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
