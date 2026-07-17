"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Marcus T. Reid",
    role: "Chief Structural Engineer",
    company: "Apex Infrastructure Ltd.",
    avatar: "MR",
    avatarColor: "#10B981",
    rating: 5,
    quote:
      "ConstructIQ's AI Estimate engine shaved three weeks off our pre-construction phase. The material takeoff accuracy is the best I've seen from any SaaS platform — period.",
  },
  {
    name: "Sarah Lin",
    role: "Construction Project Manager",
    company: "BuildCore Group",
    avatar: "SL",
    avatarColor: "#38BDF8",
    rating: 5,
    quote:
      "The AI Assistant is like having a senior engineer on call 24/7. It handles IBC queries, flags structural conflicts, and explains cost variances in plain language.",
  },
  {
    name: "James O. Okafor",
    role: "Civil Engineering Lead",
    company: "UrbanForm Consultants",
    avatar: "JO",
    avatarColor: "#A78BFA",
    rating: 5,
    quote:
      "We manage 40+ concurrent projects and ConstructIQ is the only platform that keeps material audits clean and timelines synchronized across all sites.",
  },
  {
    name: "Priya Krishnan",
    role: "Head of Cost Planning",
    company: "Meridian Construction",
    avatar: "PK",
    avatarColor: "#F59E0B",
    rating: 5,
    quote:
      "The regional pricing integration is a game-changer. Our estimates are now within 2% of actual costs — something that previously required weeks of manual research.",
  },
  {
    name: "David Chen",
    role: "VP Engineering Operations",
    company: "SkyLine Developers",
    avatar: "DC",
    avatarColor: "#10B981",
    rating: 5,
    quote:
      "Switching to ConstructIQ halved our project setup time. The dashboard is incredibly intuitive and the export-to-PDF feature is flawless.",
  },
  {
    name: "Amara Diallo",
    role: "Senior Quantity Surveyor",
    company: "Landmark Projects Inc.",
    avatar: "AD",
    avatarColor: "#38BDF8",
    rating: 5,
    quote:
      "I was skeptical about AI-driven estimates, but after seeing 97% cost accuracy on our last three builds, I'm a convert. The team loves it.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #020617 0%, #071020 50%, #020617 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-sky-400/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/30 bg-amber-500/10 text-amber-400 mb-4">
            Client Feedback
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
              Industry Experts
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Hear from structural engineers, PMs, and QS professionals who rely
            on ConstructIQ every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, delay: (idx % 3) * 0.1 }}
              className="flex flex-col gap-5 p-6 rounded-2xl border"
              style={{
                background: "rgba(15,23,42,0.6)",
                borderColor: "rgba(30,41,59,0.8)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Quote mark */}
              <div className="text-5xl font-serif leading-none text-slate-700 select-none">"</div>
              <StarRating count={t.rating} />
              <p className="text-slate-300 text-sm leading-relaxed flex-1 -mt-2">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: `rgba(${hexToRgb(t.avatarColor)},0.15)`, color: t.avatarColor, border: `1px solid rgba(${hexToRgb(t.avatarColor)},0.3)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
