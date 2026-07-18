"use client";

import Link from "next/link";

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
    <footer className="border-t border-slate-800/60 bg-[#020617] pt-16 pb-8 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">

          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              {/* Construction HardHat Custom SVG */}
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-[#020617]"
                >
                  <path d="M2 11a10 10 0 0 1 20 0v2H2v-2Z" />
                  <path d="M12 2v9" />
                  <path d="M12 2a10 10 0 0 1 5.34 1.58" />
                  <path d="M6.66 3.58A10 10 0 0 1 12 2" />
                  <path d="M2 14h20v2H2v-2Z" />
                </svg>
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

            {/* Social Custom SVGs Container */}
            <div className="flex gap-3">
              {/* GitHub SVG */}
              <a
                href="https://github.com/AritraApon"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200 bg-slate-900/30 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>

              {/* Twitter/X SVG */}
              <a
                href="https://protfolio-page-one.vercel.app"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200 bg-slate-900/30 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>

              {/* LinkedIn SVG */}
              <a
                href="https://www.linkedin.com/in/aritro-mazumdar-011206apon"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200 bg-slate-900/30 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider text-slate-200">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-emerald-400 transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ConstructIQ AI. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
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