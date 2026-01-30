"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogIn, UserPlus, LayoutDashboard, PenTool, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 font-shadows text-2xl font-bold tracking-widest text-slate-100 hover:text-purple-400 transition-colors">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-500/20 shrink-0">
             <Image src="/images/thefool.png" alt="The Fool" fill className="object-cover" />
          </div>
          ThE wIsE foOl
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/help" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Help
          </Link>
          {session && (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/write" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1">
                 <PenTool className="w-4 h-4" />
                 Write
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-purple-400 hover:text-slate-950 transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_-3px_rgba(192,132,252,0.5)]"
              >
                <UserPlus className="h-4 w-4" />
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950 px-4 py-6 space-y-4">
          <Link href="/" className="block text-base font-medium text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="block text-base font-medium text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/help" className="block text-base font-medium text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>
            Help
          </Link>
          {session && (
            <>
                <Link href="/dashboard" className="block text-base font-medium text-purple-300 hover:text-purple-200" onClick={() => setIsOpen(false)}>
                    Dashboard
                </Link>
                <Link href="/write" className="block text-base font-medium text-purple-300 hover:text-purple-200" onClick={() => setIsOpen(false)}>
                    Write
                </Link>
            </>
          )}

          <div className="pt-4 flex flex-col gap-3">
             {session ? (
                <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
             ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-purple-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Signup
                  </Link>
                </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
