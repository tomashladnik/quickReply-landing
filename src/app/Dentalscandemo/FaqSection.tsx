// src/app/(public)/Dentalscandemo/FaqSection.tsx
import { useState } from "react";

export default function FaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (i: number) => {
    setOpenFaqIndex((prev) => (prev === i ? null : i));
  };

  const faqs = [
    {
      q: "Is DentalScan HIPAA compliant?",
      a: "Yes, DentalScan is fully HIPAA compliant with end-to-end encryption, secure data storage, and comprehensive audit logs.",
    },
    {
      q: "What insurance codes does it support?",
      a: "DentalScan automatically generates claims with D9996 (teledentistry), D0140 (evaluation), and D0191 (assessment) codes.",
    },
    {
      q: "How long does patient photo submission take?",
      a: "Most patients complete their photo submission in under 5 minutes using their smartphone.",
    },
    {
      q: "What's the real cost savings?",
      a: "By recovering missed leads and automating qualification, practices typically see improved ROI through higher booking rates and reduced manual effort.",
    },
    {
      q: "Can I integrate with my practice management software?",
      a: "Yes, DentalScan integrates with major dental practice management systems via secure API connections.",
    },
    {
      q: "What kind of support do you provide?",
      a: "We offer 24/7 technical support, onboarding training, and dedicated account management for all practices.",
    },
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you want to know about ReplyQuick&apos;s lead recovery
            system.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const open = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all ${
                  open ? "shadow-lg" : ""
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-base md:text-lg font-medium text-gray-800">
                    {faq.q}
                  </span>

                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform ${
                      open ? "bg-[#4ebff7] rotate-45" : "bg-[#bfe9fb]"
                    }`}
                    aria-hidden
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`px-6 pt-0 pb-5 text-gray-600 transition-all ${
                    open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ transitionDuration: "300ms" }}
                >
                  <p className="text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
