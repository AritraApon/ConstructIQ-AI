"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the AI Estimate engine process blueprint data?",
    a: "Our engine uses a multi-stage pipeline: it parses structural blueprints and BOQ sheets, runs the data through a regional cost database indexed by ZIP/postal code, and applies material pricing APIs updated daily. The result is a precise cost model generated in under 60 seconds.",
  },
  {
    q: "Is my project data secure?",
    a: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We leverage Better Auth for session management with JWT tokens, MongoDB Atlas for cloud persistence, and zero-log inference pipelines — your structural data never leaves your provisioned tenant.",
  },
  {
    q: "What is the typical API response latency?",
    a: "Our globally distributed edge network maintains an average of ~45ms for AI Assistant queries and ~90-150ms for full AI Estimate inference runs. Larger models with complex structural datasets may take up to 30 seconds depending on blueprint complexity.",
  },
  {
    q: "Can I integrate ConstructIQ with my existing project management tools?",
    a: "Yes. We provide a RESTful API and webhook system compatible with Procore, Autodesk BIM 360, and Primavera P6. CSV/Excel export and PDF generation are available on all paid plans.",
  },
  {
    q: "How accurate are the AI-generated cost estimates?",
    a: "Based on data from 14,000+ completed projects, our estimates land within ±3% of actual costs for standard residential and commercial builds. Industrial and complex structural projects typically see ±5-8% variance, which our AI flags proactively.",
  },
  {
    q: "Is there a free tier or trial available?",
    a: "Yes — our Starter plan is free forever with up to 3 active projects and 10 AI estimates per month. We also offer a 14-day free trial on our Professional and Enterprise plans with no credit card required.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="border rounded-2xl overflow-hidden transition-colors duration-200"
      style={{
        background: isOpen ? "rgba(16,185,129,0.04)" : "rgba(15,23,42,0.5)",
        borderColor: isOpen ? "rgba(16,185,129,0.25)" : "rgba(30,41,59,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-white text-base leading-snug">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="shrink-0"
        >
          <ChevronDown
            className="w-5 h-5 transition-colors"
            style={{ color: isOpen ? "#10B981" : "#64748b" }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 px-6 max-w-4xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4">
          FAQ
        </span>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          Got{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            Questions?
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Everything you need to know about the platform, data security, and
          technical specifications.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
            }}
          >
            <FAQItem
              q={faq.q}
              a={faq.a}
              isOpen={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
