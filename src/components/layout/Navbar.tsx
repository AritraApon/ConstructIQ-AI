"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Profile dropdown state
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Better Auth Session Hook
  const { data: session, isPending } = authClient.useSession();

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Better Auth Sign Out Handler
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsDropdownOpen(false);
            setIsOpen(false);
            router.push("/login");
          }
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    ...(session ? [
      { name: "Create Estimate", href: "/items/add" },
      { name: "Manage Estimates", href: "/items/manage" }
    ] : []),
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
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

          {/* Auth Buttons / Profile Dropdown (Desktop) */}
          <div className="hidden md:block">
            {isPending ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-[#0F172A]" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full p-1 border border-[#10B981]/20 bg-[#0F172A]/40 transition-all hover:border-[#10B981]/60 focus:outline-none"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#020617]">
                    <Image
                      src={session.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={session.user?.name || "User Profile"}
                      fill
                      sizes="32px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <span className="pr-2 text-sm font-semibold text-[#F8FAFC] max-w-[120px] truncate">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <svg className={`h-4 w-4 text-[#F8FAFC]/60 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-emerald-500/10 bg-[#0F172A]/90 p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-[#F8FAFC]/80 rounded-lg hover:bg-[#10B981]/10 hover:text-[#10B981] transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
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
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#020617] border border-[#10B981]/20">
                    <Image
                      src={session.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={session.user?.name || "User Profile"}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F8FAFC]">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-[#F8FAFC]/40">{session.user?.email}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg border border-[#10B981]/10 bg-[#10B981]/5 py-2 text-sm font-semibold text-[#F8FAFC] hover:bg-[#10B981]/15"
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-center text-sm font-semibold text-red-400"
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