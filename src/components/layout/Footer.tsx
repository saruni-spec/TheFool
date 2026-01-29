import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <Link href="/about" className="hover:text-purple-400 transition-colors">
            About
          </Link>
          <Link href="/terms" className="hover:text-purple-400 transition-colors">
            Terms
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-slate-500">
          &copy; {currentYear} The Wise Fool. All rights reserved.
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:oddsthingshere@gmail.com"
            className="p-2 text-slate-400 hover:text-purple-400 transition-colors rounded-full hover:bg-white/5"
            title="Contact us"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
