/* eslint-disable @next/next/no-html-link-for-pages */
// src/app/(public)/Dentalscandemo/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import WhyItMattersSection from "./WhyItMattersSection";
import SecuritySection from "./SecuritySection";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";
import FooterSection from "./FooterSection";
import DemoModal from "./DemoModal";

export default function DentalScanPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Matching Main Page Header Style */}
      <header className="sticky top-0 z-50 w-full h-[80px] bg-white shadow-[0_0_22px_#4ebff740] backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-58">
        {/* Logo */}
        <a href="/" className="z-20">
          <Image
            src="/logo.png"
            alt="ReplyQuick Logo"
            width={100}
            height={100}
            className="object-cover rounded-lg w-[82px] h-[46px]"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-20">
          <a
            href="#"
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </a>
          <a
            href="#features"
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
          >
            Key Features
          </a>
          <a
            href="#how-it-works"
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <button
            onClick={() => setShowDemoModal(true)}
            className="px-6 py-2 text-xl font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-300/40 hover:saturate-150"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center z-30">
          <button
            onClick={() => setShowDemoModal(true)}
            className="px-4 py-2 bg-[#4ebff7] text-white rounded-lg font-semibold text-sm hover:bg-[#3da5d9] transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <HeroSection onOpenDemo={() => setShowDemoModal(true)} />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Key Features */}
      <FeaturesSection />

      {/* Why It Matters */}
      <WhyItMattersSection />

      {/* Security */}
      <SecuritySection />

      {/* FAQ */}
      <FaqSection />

      {/* CTA Section */}
      <CtaSection onOpenDemo={() => setShowDemoModal(true)} />

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal open={showDemoModal} onClose={() => setShowDemoModal(false)} />

      {/* Local styles used by multiple sections */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scan {
          0%,
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
          50% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
