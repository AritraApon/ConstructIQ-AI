"use client";

import Link from "next/link";
import { HardHat, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "AI Estimate", href: "/items/add" },
    { label: "AI Assistant", href: "/" },
    { label: "Project Management", href: "/items/manage" },
    { label: "Explore Projects", href: "/explore" },
  ],
  Company: [
    { label: "About Us", href: "/" },
    { label: "Case Studies", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Careers", href: "/" },
  ],
  Support: [
    { label: "Documentation", href: "/" },
    { label: "API Reference", href: "/" },
    { label: "System Status", href: "/" },
    { label: "Contact Us", href: "/" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
    { label: "Security", href: "/" },
    { label: "GDPR", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-[#020617] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <HardHat className="w-4 h-4 text-[#020617]" />
              </div>
              <span className="text-xl font-extrabold tracking-wide text-white">
                Construct<span className="text-emerald-400">IQ</span>
              </span>
              <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-400/20">
                AI
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              Next-generation AI-powered cost estimation and project intelligence
              for civil engineering and construction teams worldwide.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ConstructIQ AI. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
