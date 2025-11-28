import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "./components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReplyQuick | Automation & DentalScan Solutions",
  description:
    "ReplyQuick automates your customer workflow end-to-end, DentalScan empowers clinics with instant dental assessments and clear, guided reporting.",
  icons: './favicon.ico'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      
      {/* --- CORE IMPROVEMENT: Flexible layout with flexbox --- */}
      {/* This ensures the footer is pushed to the bottom of the screen on short pages. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-gray-50 antialiased text-gray-900`}
      >
        {/* Accessibility: Skip link (already well-implemented) */}
        <a
          href="#main-content"
          className="sr-only absolute top-2 left-2 z-[9999] rounded bg-white px-4 py-2 shadow focus:not-sr-only"
        >
          Skip to main content
        </a>

        {/* Use the LayoutWrapper to conditionally show header/footer */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
