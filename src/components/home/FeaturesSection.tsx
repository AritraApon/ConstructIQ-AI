"use client";

import { motion } from "framer-motion";
import { Calculator, Bot, ClipboardList, ArrowUpRight } from "lucide-react";

const cards = [
  {
    icon: Calculator,
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.2)",
    title: "AI Estimate",
    description:
      "Upload blueprints and BOQ sheets — our engine instantly processes structural models to generate pinpoint material takeoffs and cost projections.",
    bullets: ["Structural model parsing", "Regional pricing APIs", "Instant PDF reports"],
    badge: "Core Feature",
  },
  {
    icon: Bot,
    accent: "#38BDF8",
    accentBg: "rgba(56,189,248,0.08)",
    accentBorder: "rgba(56,189,248,0.2)",
    title: "AI Assistant",
    description:
      "An always-on conversational agent trained on civil engineering codes, IBC standards, and real-time project context. Ask anything, get expert answers.",
    bullets: ["IBC & ACI code queries", "Real-time session context", "Structural constraint checks"],
    badge: "AI-Powered",
  },
  {
    icon: ClipboardList,
    accent: "#A78BFA",
    accentBg: "rgba(167,139,250,0.08)",
    accentBorder: "rgba(167,139,250,0.2)",
    title: "Project Management",
    description:
      "Track, audit, and forecast your material pipelines, task timelines, and labor costs across multiple concurrent project zones — all in one place.",
    bullets: ["Gantt-style tracking", "Material audit logs", "Team collaboration"],
    badge: "Workflow",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
} as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4">
          What We Offer
        </span>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          Everything You Need to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            Build Smarter
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          A unified intelligence layer for the entire project lifecycle — from
          first estimate to final delivery.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="group relative flex flex-col p-8 rounded-2xl border overflow-hidden cursor-default"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 100%)",
                borderColor: "rgba(30,41,59,0.8)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Glassmorphism shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${card.accentBg} 0%, transparent 70%)`,
                }}
              />
              {/* Top accent border */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
                  opacity: 0.6,
                }}
              />

              <div className="relative z-10 flex flex-col gap-5 flex-1">
                {/* Badge + Icon row */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                    style={{ color: card.accent, borderColor: card.accentBorder, background: card.accentBg }}
                  >
                    {card.badge}
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300"
                    style={{ background: card.accentBg, borderColor: card.accentBorder }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.accent }} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{card.description}</p>
                </div>

                <ul className="space-y-2">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: card.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4">
                  <button
                    className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                    style={{ color: card.accent }}
                  >
                    Learn more <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
