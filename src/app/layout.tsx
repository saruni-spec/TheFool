import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Shadows_Into_Light } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const shadows = Shadows_Into_Light({
  variable: "--font-shadows",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Wise Fool | Philosophy, Psychology & Humor",
  description: "Where wisdom wears a jester's hat - philosophy, psychology, and insights on life's complexities with humor and occasional accidental brilliance.",
  keywords: ["philosophy", "psychology", "satire", "mental health", "wisdom", "humor"],
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${shadows.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
              {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
