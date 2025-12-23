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
import DentalScanNav from "../components/DentalScanNav";

export default function DentalScanPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <DentalScanNav activePage="home" onOpenDemo={() => setShowDemoModal(true)} />

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
