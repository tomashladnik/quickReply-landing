"use client";

import { useState } from "react";
import PartnerWithUsModal from "../PartnerWithUsModal";
import Link from "next/link";
import DentalScanNav from "../../components/DentalScanNav";

export default function EmployersPage() {
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <DentalScanNav activePage="employers" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-linear-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#4ebff7]/10 text-[#4ebff7] border border-[#4ebff7]/20">
                  Powered by ReplyQuick
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="block">Employer Program</span>
                <span className="block text-[#4EBFF7]">DentalScan for Employee Populations</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Preventive Oral Health Screening—simple, scalable, and privacy-respectful
              </p>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                DentalScan offers employers a preventive oral health screening program that employees can
                complete on their phone—without appointments, clinics, or administrative complexity.
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Designed for organizations that want to support employee health, reduce unplanned absences,
                and offer a meaningful wellness benefit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-8 py-4 bg-[#4ebff7] text-white rounded-lg font-semibold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setShowPartnerModal(true)}
                >
                  Partner with DentalScan
                </button>

                <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Request Employer Information
                </button>
              </div>
            </div>

            {/* Right Content - Program Snapshot Card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-700">Employer Wellness</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-4 border-b mb-6">
                    <h3 className="text-xl font-bold text-gray-900">How It Works</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Simple Setup
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Employees scan a QR code",
                        desc: "Access a secure link during scheduled preventive intervals",
                      },
                      {
                        title: "Guided photo capture",
                        desc: "Employees complete a guided oral photo capture on their phone",
                      },
                      {
                        title: "AI-assisted screening",
                        desc: "Structured screening outputs and clear next-step guidance",
                      },
                      {
                        title: "Two outputs",
                        desc: "Employee wellness summary + professional report when appropriate",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-white font-bold">{idx + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      DentalScan does not diagnose, treat, or replace dental professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerWithUsModal open={showPartnerModal} onClose={() => setShowPartnerModal(false)} />

      {/* Who This Program Is For */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Who This Program Is For</h2>
            <p className="text-xl text-gray-600">
              Built for organizations with distributed, on-site, or physically active workforces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Construction and skilled trades",
              "Manufacturing and industrial operations",
              "Logistics, transportation, and warehousing",
              "Field service and on-site teams",
              "Corporate offices seeking modern wellness programs",
              "Employee populations needing easy preventive access",
            ].map((label) => (
              <div
                key={label}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-900 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Preventive Oral Health Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Preventive Oral Health Matters for Employers
            </h2>
            <p className="text-xl text-gray-600">
              Oral health issues can impact attendance, safety, and performance—often before they become emergencies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Unplanned Absences",
                desc: "Dental pain and oral infections are a common cause of unexpected sick days and job disruption—especially in physically demanding roles.",
              },
              {
                title: "Emergency-Only Care",
                desc: "Without preventive awareness, issues are often addressed only once urgent, increasing disruption and downstream costs.",
              },
              {
                title: "Workplace Impact",
                desc: "Oral health can affect concentration, safety, and overall performance—even before escalation.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-xl text-gray-600">
              Identify potential concerns early—before they become disruptive or costly
            </p>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-10 text-white">
            <div className="max-w-4xl mx-auto space-y-4 text-center">
              <p className="text-xl leading-relaxed">
                Employees complete a guided oral photo capture on their phone. DentalScan generates structured
                screening outputs and clear next-step guidance—without diagnoses or treatment.
              </p>
              <p className="text-lg opacity-95">
                When appropriate, a professional screening report is produced for follow-up by a licensed dental professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Structure</h2>
            <p className="text-xl text-gray-600">
              Preventive screening intervals aligned with standard dental care—flexible based on workforce needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Two screenings per year</h3>
              <p className="text-gray-600">
                Aligned with traditional preventive dental checkup intervals and widely adopted across employee wellness programs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Three screenings per year</h3>
              <p className="text-gray-600">
                Higher-engagement option (about every four months), often selected for distributed or physically demanding workforces.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              Program frequency is selected based on workforce size, job type, and organizational goals. DentalScan supports employers
              in selecting the right cadence during onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* What Employers Receive / What Employees Experience */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Employers Receive</h2>
              <ul className="space-y-4">
                {[
                  "A preventive oral health screening program for employees",
                  "Minimal administrative involvement",
                  "No access to individual health data",
                  "Aggregate, anonymized participation and trend insights",
                  "A modern wellness benefit employees engage with",
                ].map((t) => (
                  <li key={t} className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Employees Experience</h2>
              <ul className="space-y-4">
                {[
                  "Quick, non-invasive screening completed from their phone",
                  "Clear, easy-to-understand wellness summaries",
                  "Guidance on next steps when appropriate",
                  "No disruption to work schedules",
                ].map((t) => (
                  <li key={t} className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What DentalScan Is and Is Not */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What DentalScan Is and Is Not</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-6">DentalScan IS</h3>
              <ul className="space-y-4">
                {[
                  "A preventive screening and early awareness tool",
                  "A scalable wellness benefit for employee populations",
                  "A support layer for licensed dental professionals",
                ].map((t) => (
                  <li key={t} className="text-gray-700">• {t}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-red-600 mb-6">DentalScan IS NOT</h3>
              <ul className="space-y-4">
                {["A diagnosis", "A treatment plan", "Medical or dental advice", "A replacement for dental care"].map((t) => (
                  <li key={t} className="text-gray-700">• {t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-white">
              <p className="text-xl font-medium">
                All clinical decisions remain the responsibility of licensed dental professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy, Security, and Responsible Use */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Privacy, Security, and Responsible Use</h2>
            <p className="text-xl text-gray-600">Built with privacy, security, and responsible technology at its core</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              "Secure encryption in transit and at rest",
              "Role-restricted access controls",
              "No medical diagnoses delivered to end users",
              "Employers receive only anonymized, aggregate insights",
              "Designed to support HIPAA-aligned workflows when used with licensed providers",
            ].map((t) => (
              <div
                key={t}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <p className="text-gray-700 font-medium">{t}</p>
              </div>
            ))}
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Partner With DentalScan</h3>
            <p className="text-xl mb-8 opacity-95">
              Offer your workforce a preventive oral health benefit that is simple, modern, and impactful.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-white text-[#4ebff7] rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg transform hover:scale-105"
                onClick={() => setShowPartnerModal(true)}
              >
                Partner with DentalScan
              </button>
              <button className="px-8 py-4 bg-white/20 text-white border border-white rounded-lg font-semibold text-lg hover:bg-white/30 transition-all">
                Request Employer Information
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-white">DentalScan Employer Program</h3>
              <p className="text-blue-100">is part of the DentalScan platform by ReplyQuick LLC</p>
            </div>
            <div className="border-t border-white/20 pt-6">
              <div className="flex justify-center space-x-6 mb-4">
                <Link href="/dentalscan/privacy" className="text-blue-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/dentalscan" className="text-blue-100 hover:text-white transition-colors">
                  DentalScan Platform
                </Link>
              </div>
              <p className="text-sm text-blue-100">© 2025 ReplyQuick LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
