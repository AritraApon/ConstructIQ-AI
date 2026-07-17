"use client";

import React, { useState } from "react";
import {
  HeadphonesIcon,
  BookOpen,
  Activity,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactCard {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
  statusDot?: boolean;
}

interface TicketForm {
  fullName: string;
  email: string;
  priority: "low" | "medium" | "critical" | "";
  description: string;
}

type SubmitStatus = "idle" | "success" | "error";

// ─── Data ─────────────────────────────────────────────────────────────────────

const contactCards: ContactCard[] = [
  {
    id: "technical",
    icon: HeadphonesIcon,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.10)",
    badgeText: "Live Support",
    badgeColor: "#10B981",
    title: "Live Technical Assist",
    description:
      "Direct access to our structural engineering support team for compilation errors, API failures, and real-time system debugging.",
    cta: "Start Live Chat",
    ctaHref: "#ticket",
    statusDot: true,
  },
  {
    id: "docs",
    icon: BookOpen,
    iconColor: "#38BDF8",
    iconBg: "rgba(56,189,248,0.10)",
    badgeText: "Reference",
    badgeColor: "#38BDF8",
    title: "Documentation & APIs",
    description:
      "Comprehensive API reference for our estimation logic engine, structural model schemas, and material takeoff endpoints.",
    cta: "Browse Docs",
    ctaHref: "#",
  },
  {
    id: "status",
    icon: Activity,
    iconColor: "#A78BFA",
    iconBg: "rgba(167,139,250,0.10)",
    badgeText: "Operational",
    badgeColor: "#10B981",
    title: "System Operations",
    description:
      "Real-time platform health dashboard covering API gateways, AI inference nodes, MongoDB clusters, and auth services.",
    cta: "View Status Page",
    ctaHref: "#",
    statusDot: true,
  },
];

const priorityOptions: { value: TicketForm["priority"]; label: string; color: string }[] = [
  { value: "low", label: "Low — General inquiry or feature request", color: "#64748b" },
  { value: "medium", label: "Medium — Estimate accuracy or workflow issue", color: "#F59E0B" },
  { value: "critical", label: "Critical Structural — System failure or data loss", color: "#EF4444" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
      {children}
    </span>
  );
}

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-300">
        {label}
        {required && <span className="text-emerald-400 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SupportPage() {
  const [form, setForm] = useState<TicketForm>({
    fullName: "",
    email: "",
    priority: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setForm((prev) => ({ ...prev, priority: e.currentTarget.value as TicketForm["priority"] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call — replace with real endpoint
      await new Promise<void>((resolve) => setTimeout(resolve, 1800));
      setSubmitStatus("success");
      setForm({ fullName: "", email: "", priority: "", description: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.priority !== "" &&
    form.description.trim() !== "";

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] selection:bg-emerald-500/30">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/8 blur-[140px]" />
        <div className="absolute bottom-0 right-[-5%] w-[35vw] h-[35vw] rounded-full bg-sky-400/8 blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* ── 1. Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <SectionLabel>
            <Zap className="w-3.5 h-3.5" />
            Support Center
          </SectionLabel>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5">
            ConstructIQ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
              Resolution Center
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Expert technical support for your structural engineering operations.
            From AI estimation anomalies to auth session failures — we&apos;re
            here to keep your projects running at full capacity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-400">
            {[
              { icon: Clock, label: "Avg. response time: 4 hours" },
              { icon: CheckCircle2, label: "99.4% issue resolution rate" },
              { icon: Activity, label: "24/7 critical structural support" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-slate-400">
                <Icon className="w-4 h-4 text-emerald-400" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── 2. Quick Contact Grid ──────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group flex flex-col gap-5 p-6 rounded-2xl border border-slate-800/80 bg-[#0F172A]/60 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${card.iconBg} 0%, transparent 70%)`,
                  }}
                />

                <div className="flex items-start justify-between relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      background: card.iconBg,
                      borderColor: `${card.iconColor}30`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {card.statusDot && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: card.badgeColor }} />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: card.badgeColor }} />
                      </span>
                    )}
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={{
                        color: card.badgeColor,
                        borderColor: `${card.badgeColor}30`,
                        background: `${card.badgeColor}12`,
                      }}
                    >
                      {card.badgeText}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
                </div>

                <a
                  href={card.ctaHref}
                  className="relative z-10 flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3 mt-auto"
                  style={{ color: card.iconColor }}
                >
                  {card.cta}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* ── 3. Ticket Generation Form ──────────────────────────────────────── */}
        <div
          id="ticket"
          className="rounded-2xl border border-slate-800/80 bg-[#0F172A]/60 backdrop-blur-md p-8 md:p-12 relative overflow-hidden"
        >
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

          <div className="mb-10">
            <SectionLabel>
              <Send className="w-3.5 h-3.5" />
              Submit a Ticket
            </SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Open a Support Request
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Describe your issue in detail and our engineering support team will
              respond within the SLA for your selected priority tier.
            </p>
          </div>

          {/* Success / Error Banners */}
          {submitStatus === "success" && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-8">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Ticket submitted successfully!</p>
                <p className="text-xs text-emerald-400/70 mt-0.5">Our team will contact you at your corporate email within the priority SLA window.</p>
              </div>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-8">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-semibold text-red-300">Submission failed. Please try again or contact us directly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" noValidate>
            {/* Full Name */}
            <InputField
              id="fullName"
              label="Full Name"
              placeholder="e.g. Marcus T. Reid"
              value={form.fullName}
              onChange={handleInputChange}
              required
            />

            {/* Corporate Email */}
            <InputField
              id="email"
              label="Corporate Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleInputChange}
              required
            />

            {/* Priority Selector */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="priority" className="text-sm font-semibold text-slate-300">
                Project Priority<span className="text-emerald-400 ml-1">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handlePriorityChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="" disabled>Select priority level…</option>
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-300">
                Issue Description<span className="text-emerald-400 ml-1">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe the issue in detail — include error codes, affected project IDs, steps to reproduce, and expected vs actual behavior…"
                value={form.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                {form.description.length} / 2000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#020617] px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:shadow-[0_0_25px_rgba(16,185,129,0.40)] active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[#020617]/30 border-t-[#020617] animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Support Ticket
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500">
                By submitting, you agree to our support SLA and data processing policy.
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
