"use client";

import { motion } from "framer-motion";
import { FolderPlus, Cpu, CloudUpload } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: FolderPlus,
    title: "Add Project",
    desc: "Initialize a new project by entering structural parameters, project location, and uploading blueprint data. ConstructIQ organizes everything into a structured dataset.",
    accent: "#10B981",
  },
  {
    num: "02",
    icon: Cpu,
    title: "Generate AI Estimate",
    desc: "Our neural inference engine processes your blueprint data against regional cost databases, structural constraints, and material pricing APIs to produce a precise cost model.",
    accent: "#38BDF8",
  },
  {
    num: "03",
    icon: CloudUpload,
    title: "Save & Deploy Project",
    desc: "With one click, deploy your verified estimate dataset to the cloud. Share securely with your team, export to PDF, or push updates across active project nodes.",
    accent: "#A78BFA",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="process"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020617 0%, #0a1628 50%, #020617 100%)" }}
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-sky-500/30 bg-sky-500/10 text-sky-400 mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Three Steps to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
              Precision
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Our streamlined pipeline transforms raw blueprint data into
            deployment-ready cost estimates.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col gap-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.num} className="relative flex gap-8 pb-0">
                {/* Left: number + connector line */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 120, delay: idx * 0.15 }}
                    className="relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 z-10 shrink-0"
                    style={{
                      borderColor: step.accent,
                      background: `radial-gradient(circle, rgba(${hexToRgb(step.accent)},0.15) 0%, rgba(15,23,42,0.9) 80%)`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.accent }} />
                  </motion.div>

                  {/* Connector line */}
                  {!isLast && (
                    <motion.div
                      className="w-px flex-1 my-2"
                      style={{
                        background: `linear-gradient(to bottom, ${step.accent}80, ${steps[idx + 1].accent}40)`,
                      }}
                      initial={{ scaleY: 0, originY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.2 + 0.2, ease: "easeOut" }}
                    />
                  )}
                </div>

                {/* Right: content card */}
                <motion.div
                  className="flex-1 pb-12"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 80, delay: idx * 0.15 }}
                >
                  <div
                    className="p-6 rounded-2xl border"
                    style={{
                      background: "rgba(15,23,42,0.5)",
                      borderColor: "rgba(30,41,59,0.8)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          color: step.accent,
                          background: `rgba(${hexToRgb(step.accent)},0.1)`,
                        }}
                      >
                        STEP {step.num}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0,0,0";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
