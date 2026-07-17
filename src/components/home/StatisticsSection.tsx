"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FolderOpen, Users, Sparkles } from "lucide-react";

const chartData = [
  { month: "Jan", estimates: 120, projects: 45 },
  { month: "Feb", estimates: 280, projects: 78 },
  { month: "Mar", estimates: 450, projects: 110 },
  { month: "Apr", estimates: 730, projects: 160 },
  { month: "May", estimates: 1100, projects: 210 },
  { month: "Jun", estimates: 1650, projects: 290 },
  { month: "Jul", estimates: 2100, projects: 380 },
];

const stats = [
  { icon: FolderOpen, label: "Total Projects Managed", value: 14200, suffix: "+", color: "#10B981" },
  { icon: Users, label: "Active Global Users", value: 8500, suffix: "+", color: "#38BDF8" },
  { icon: Sparkles, label: "AI Estimates Generated", value: 2100000, suffix: "+", color: "#A78BFA" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  color: string;
  delay: number;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2200, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const formatted =
    value >= 1_000_000
      ? (count / 1_000_000).toFixed(1) + "M"
      : value >= 1_000
      ? (count / 1_000).toFixed(1) + "k"
      : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 80, delay }}
      className="flex flex-col gap-4 p-6 rounded-2xl border"
      style={{
        background: "rgba(15,23,42,0.7)",
        borderColor: "rgba(30,41,59,0.9)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `rgba(${hexToRgb(color)},0.12)`, border: `1px solid rgba(${hexToRgb(color)},0.25)` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="text-3xl font-extrabold text-white tracking-tight">
          {formatted}
          <span style={{ color }}>{suffix}</span>
        </div>
        <div className="text-sm text-slate-400 mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StatisticsSection() {
  return (
    <section id="stats" className="py-28 px-6 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-violet-500/30 bg-violet-500/10 text-violet-400 mb-4">
          Platform Metrics
        </span>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          Numbers That{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            Speak for Themselves
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Real-time platform intelligence powering decisions for engineers
          worldwide.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.1} />
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 70, delay: 0.2 }}
        className="rounded-2xl border p-6 pt-8 relative overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.7)",
          borderColor: "rgba(30,41,59,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Estimation Growth Trend</h3>
            <p className="text-sm text-slate-400">Monthly AI estimates generated (2025)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-0.5 rounded bg-emerald-400" /> AI Estimates
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-0.5 rounded bg-sky-400" /> Projects
            </span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gEstimate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gProjects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="estimates"
                name="AI Estimates"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#gEstimate)"
              />
              <Area
                type="monotone"
                dataKey="projects"
                name="Projects"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fill="url(#gProjects)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0,0,0";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
