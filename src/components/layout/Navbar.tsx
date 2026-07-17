"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Better Auth-এর ক্লায়েন্ট স্টেট (তোমার auth client ফাইল অনুযায়ী ইমপোর্ট পাথ চেঞ্জ করতে পারো)
// আপাতত আমি dummy state দিয়ে রাখছি যাতে তোমার কোড না ভাঙে। পরে auth.useSession() দিয়ে কানেক্ট করে নেবে।
const useSessionMock = () => {
  // auth setup করার পর এটা সরিয়ে অরিজিনাল Better Auth session ইউজ করবে
  const session = null; // লগইন স্টেট টেস্ট করতে এটাকে { user: { name: "Aritro" } } বানিয়ে দেখতে পারো
  const isPending = false;
  return { data: session, isPending };
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSessionMock();

  // Better Auth Logout function (এখানে তোমার অরিজিনাল signout ফাংশন কল হবে)
  const handleLogout = async () => {
    console.log("Logging out...");
    // await authClient.signOut()
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    ...(session ? [{ name: "Manage Estimates", href: "/items/manage" }] : []),
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-500/10 bg-[#020617]/75 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-wider text-[#F8FAFC]">
                Construct<span className="text-[#10B981]">IQ</span>
              </span>
              <span className="rounded-full bg-[#38BDF8]/10 px-2 py-0.5 text-xs font-semibold text-[#38BDF8] border border-[#38BDF8]/20">
                AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-[#10B981] ${
                    isActive(link.href) ? "text-[#10B981]" : "text-[#F8FAFC]/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons / Profile Panel */}
          <div className="hidden md:block">
            {isPending ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-[#0F172A]" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-[#F8FAFC]/90">
                  Hi, <span className="text-[#38BDF8]">{session.user?.name || "User"}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-[#10B981]/20 bg-[#10B981]/10 px-4 py-2 text-sm font-semibold text-[#10B981] transition-all duration-200 hover:bg-[#10B981] hover:text-[#020617] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[#F8FAFC] transition-colors duration-200 hover:text-[#10B981]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#10B981] px-4 py-2 text-sm font-bold text-[#020617] transition-all duration-200 hover:bg-[#10B981]/90 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#F8FAFC]/80 hover:bg-[#0F172A] hover:text-[#10B981] focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden border-t border-[#10B981]/10 bg-[#020617]`}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "text-[#F8FAFC]/80 hover:bg-[#0F172A] hover:text-[#10B981]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Auth actions in Mobile menu */}
          <div className="border-t border-[#0F172A] pt-4 mt-4 px-3">
            {session ? (
              <div className="flex flex-col space-y-3">
                <span className="text-sm font-medium text-[#F8FAFC]/90">
                  Signed in as <span className="text-[#38BDF8]">{session.user?.name}</span>
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg border border-[#10B981]/20 bg-[#10B981]/10 py-2 text-center text-sm font-semibold text-[#10B981]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg py-2 text-sm font-semibold text-[#F8FAFC] hover:bg-[#0F172A]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg bg-[#10B981] py-2 text-sm font-bold text-[#020617]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}