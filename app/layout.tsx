import "./globals.css";
import type { Metadata } from "next";
import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ariadnenexus.com"),
  title: "Ariadne Nexus",
  description: "Ariadne Nexus: automation-first workflows, daily runners, and AI-powered developer tooling.",
  keywords: ["automation", "AI workflows", "GitHub integration", "OpenAI", "DevOps", "systems"],
  authors: [{ name: "Ariadne Nexus" }],
  openGraph: {
    title: "Ariadne Nexus",
    description: "Ariadne Nexus: automation-first workflows, daily runners, and AI-powered developer tooling.",
    url: "https://www.ariadnenexus.com",
    siteName: "Ariadne Nexus",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ariadne Nexus",
    description: "Ariadne Nexus: automation-first workflows, daily runners, and AI-powered developer tooling.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Vercel Analytics - automatically enabled on Vercel */}
        {/* Add Google Analytics or other analytics here if needed */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
