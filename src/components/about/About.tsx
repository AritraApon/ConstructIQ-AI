"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  ShieldCheck,
  Database,
  Calculator,
  Target,
  Users,
  TrendingUp,
  Layers,
  ArrowRight,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricCard {
  id: string;
  value: string;
  label: string;
  suffix: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

interface TechCard {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  layer: string;
  title: string;
  description: string;
  tags: string[];
}

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  avatarColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const metrics: MetricCard[] = [
  {
    id: "estimates",
    value: "2.1",
    suffix: "M+",
    label: "Estimates Calculated",
    color: "#10B981",
    icon: Calculator,
    description: "AI-generated structural cost estimates delivered to engineering teams globally.",
  },
  {
    id: "accuracy",
    value: "97.3",
    suffix: "%",
    label: "AI Accuracy Rate",
    color: "#38BDF8",
    icon: Target,
    description: "Average variance between AI projections and finalized contractor quotes.",
  },
  {
    id: "teams",
    value: "1,200",
    suffix: "+",
    label: "Engineering Teams",
    color: "#A78BFA",
    icon: Users,
    description: "Civil engineering firms and construction PMs onboarded across 40+ countries.",
  },
  {
    id: "growth",
    value: "340",
    suffix: "%",
    label: "YoY Platform Growth",
    color: "#F59E0B",
    icon: TrendingUp,
    description: "Year-over-year growth in estimate volume since our public platform launch.",
  },
];

const techStack: TechCard[] = [
  {
    id: "nextjs",
    icon: Layers,
    iconColor: "#F8FAFC",
    iconBg: "rgba(248,250,252,0.08)",
    layer: "Frontend Layer",
    title: "Next.js App Router",
    description:
      "Server-first rendering architecture with React Server Components, streaming, and edge-optimized delivery for sub-second dashboard loads globally.",
    tags: ["App Router", "RSC", "Turbopack", "TypeScript"],
  },
  {
    id: "auth",
    icon: ShieldCheck,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.10)",
    layer: "Auth Layer",
    title: "Better Auth",
    description:
      "Enterprise-grade authentication with session management, JWT rotation, OAuth providers, and tenant-isolated project scoping for multi-org workspaces.",
    tags: ["JWT Sessions", "OAuth 2.0", "Tenant Isolation", "RBAC"],
  },
  {
    id: "db",
    icon: Database,
    iconColor: "#38BDF8",
    iconBg: "rgba(56,189,248,0.10)",
    layer: "Data Layer",
    title: "MongoDB Atlas",
    description:
      "Globally distributed cloud-native document store backing structural blueprint datasets, material indexes, and project state with real-time sync across regions.",
    tags: ["Document Store", "Atlas Clusters", "Change Streams", "Global Reads"],
  },
  {
    id: "engine",
    icon: Cpu,
    iconColor: "#A78BFA",
    iconBg: "rgba(167,139,250,0.10)",
    layer: "AI Engine",
    title: "Estimation Engine",
    description:
      "Proprietary ML inference pipeline processing structural BOQ schemas against regional pricing APIs, executing cost algorithms in under 120ms per computation.",
    tags: ["Neural Inference", "Regional APIs", "BOQ Parsing", "Cost Modeling"],
  },
];

const team: TeamMember[] = [
  { initials: "A", name: "Aritro ", role: "Founder & Lead Engineer", avatarColor: "#10B981" },
  { initials: "M", name: "Mazumdar", role: "AI Systems Architect", avatarColor: "#38BDF8" },
  { initials: "A", name: "Apon", role: "Structural Data Lead", avatarColor: "#A78BFA" },
  { initials: "K", name: "Kabbo", role: "Product & UX", avatarColor: "#F59E0B" },
];

// ─── Framer Motion Variants ───────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18, delay },
  }),
} as const;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
 } as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children, color = "emerald" }: { children: React.ReactNode; color?: "emerald" | "sky" | "violet" }) {
  const styles: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    sky: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-4 ${styles[color]}`}>
      {children}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-emerald-500/6 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-sky-400/6 blur-[140px]" />
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-violet-500/4 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* ── 1. Mission Statement ───────────────────────────────────────────── */}
        <section className="pt-24 pb-28 relative">
          {/* Thin top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>
                <Zap className="w-3.5 h-3.5" />
                Our Mission
              </SectionLabel>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={0.05}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-8"
            >
              Engineering Intelligence{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                By Design
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.1}
              className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              ConstructIQ AI was founded on a single conviction: that the gap between{" "}
              <strong className="text-white font-semibold">machine learning precision</strong> and{" "}
              <strong className="text-white font-semibold">structural engineering constraints</strong> is not a
              technical barrier — it&apos;s an integration problem. We exist to solve it.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={0.15}
              className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
            >
              Our platform fuses neural inference pipelines directly into civil engineering workflows —
              automating material takeoffs, validating structural cost models against live regional pricing
              APIs, and delivering project intelligence that previously required entire estimation departments.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.2}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="/register"
                className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95"
              >
                Start Building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/support"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 transition-all duration-200"
              >
                Talk to Our Team
              </a>
            </motion.div>
          </motion.div>

          {/* Decorative grid */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </section>

        {/* ── 2. Feature Metrics Matrix ──────────────────────────────────────── */}
        <section className="py-24 border-t border-slate-800/60">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel color="sky">
              <TrendingUp className="w-3.5 h-3.5" />
              Platform Metrics
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Proven at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                Scale
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Measurable outcomes validated across thousands of real-world structural projects.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.id}
                  variants={cardVariant}
                  className="group flex flex-col gap-4 p-6 rounded-2xl border border-slate-800/80 bg-[#0F172A]/60 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${metric.color}10 0%, transparent 60%)` }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border relative z-10"
                    style={{ background: `${metric.color}15`, borderColor: `${metric.color}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: metric.color }} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl font-extrabold tracking-tight" style={{ color: metric.color }}>
                      {metric.value}
                      <span className="text-2xl">{metric.suffix}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1 mb-2">{metric.label}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{metric.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── 3. Strategic Tech Stack ────────────────────────────────────────── */}
        <section className="py-24 border-t border-slate-800/60">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel color="violet">
              <Cpu className="w-3.5 h-3.5" />
              Architecture
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Built on a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                Modern Foundation
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Every layer of our stack is chosen for production-grade reliability, engineering-scale data, and global performance.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.id}
                  variants={cardVariant}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="group flex flex-col gap-5 p-7 rounded-2xl border border-slate-800/80 bg-[#0F172A]/60 backdrop-blur-md hover:border-slate-700 transition-all duration-300 relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 25% 25%, ${tech.iconBg} 0%, transparent 70%)` }}
                  />
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-40 group-hover:opacity-80 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${tech.iconColor}, transparent)` }}
                  />

                  <div className="flex items-start gap-4 relative z-10">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: tech.iconBg, borderColor: `${tech.iconColor}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tech.iconColor }} />
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{ color: tech.iconColor, background: `${tech.iconColor}15` }}
                      >
                        {tech.layer}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{tech.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed relative z-10">{tech.description}</p>

                  <div className="flex flex-wrap gap-2 relative z-10">
                    {tech.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── 4. Team Strip ─────────────────────────────────────────────────── */}
        <section className="py-24 border-t border-slate-800/60">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>
              <Users className="w-3.5 h-3.5" />
              Core Team
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              The People Behind{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                ConstructIQ
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {team.map((member ) => (
              <motion.div
                key={member.name}
                variants={cardVariant}
                className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-slate-800/80 bg-[#0F172A]/60 backdrop-blur-md w-full sm:w-56 hover:border-slate-700 transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold border"
                  style={{
                    background: `${member.avatarColor}15`,
                    borderColor: `${member.avatarColor}30`,
                    color: member.avatarColor,
                  }}
                >
                  {member.initials}
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{member.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{member.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Bottom CTA strip ─────────────────────────────────────────────── */}
        <section className="py-20 border-t border-slate-800/60">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                Estimating Process?
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
              Join over 1,200 engineering teams already using ConstructIQ AI to
              eliminate manual estimation and deliver projects on budget.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] active:scale-95"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/support"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-200 transition-all duration-200"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
