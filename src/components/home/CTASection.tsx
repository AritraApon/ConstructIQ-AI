"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="relative overflow-hidden rounded-[2rem] border p-12 md:p-20 text-center"
        style={{
          borderColor: "rgba(16,185,129,0.2)",
          background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(7,16,40,0.98) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Radial glow center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-emerald-500/15 blur-[100px]" />
        </div>

        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60" />

        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-500/30 rounded-br-xl" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Deploy in Minutes
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring", stiffness: 80 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6"
          >
            Your Next Project Estimate
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Starts Here.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Join thousands of engineers and project managers using ConstructIQ to
            generate AI-powered cost estimates in seconds — no manual spreadsheets,
            no guesswork.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/items/add"
              className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] active:scale-95"
            >
              Start Planning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-10 py-5 rounded-2xl font-semibold text-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 transition-all duration-200"
            >
              Explore Projects
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mt-6 text-sm text-slate-500"
          >
            Free plan available · No credit card required · 14-day Pro trial
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
