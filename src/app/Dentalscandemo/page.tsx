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
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="ReplyQuick Logo"
                width={120}
                height={40}
                className="w-[100px] h-auto object-contain"
                priority
              />
            </a>

            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6 items-center">
                <span className="text-gray-600 hover:text-[#4ebff7] transition-colors">
                  DentalScan
                </span>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#4ebff7] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-[#4ebff7] transition-colors"
                >
                  Key Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-[#4ebff7] transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#faq"
                  className="text-gray-600 hover:text-[#4ebff7] transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowDemoModal(true)}
              className="px-6 py-2.5 bg-[#4ebff7] text-white rounded-lg font-semibold hover:bg-[#3da5d9] transition-colors shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

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
