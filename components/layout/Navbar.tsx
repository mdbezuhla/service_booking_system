"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-7 7m7-7l-7-7" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Glamour
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="/staff" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              Our Team
            </Link>
            <Link href="/book" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
              Book Now
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">Admin</Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-neutral-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800">
          <div className="px-4 py-4 space-y-3">
            <Link href="/services" className="block text-neutral-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/staff" className="block text-neutral-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Our Team
            </Link>
            <Link href="/book" className="block text-neutral-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Book Now
            </Link>
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              {session ? (
                <>
                  <Link href="/dashboard" className="block text-neutral-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => signOut()} className="block text-neutral-400 hover:text-white transition-colors py-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="block text-neutral-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
