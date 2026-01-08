// src/app/dentalscan/charity/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DentalScanNav from "../../components/DentalScanNav";
import PartnerWithUsModal from "../PartnerWithUsModal";

export default function CharityPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const donationAmounts = [
    { amount: 5, children: 1 },
    { amount: 25, children: 5 },
    { amount: 50, children: 10 },
    { amount: 100, children: 20 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <DentalScanNav activePage="charity" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-blue-50/50 to-white">
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
                DentalScan{" "}
                <span className="block text-[#4EBFF7]">Charity Program</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Preventive Oral Health Screening for Underserved Communities
              </p>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                DentalScan is an AI powered oral health screening platform
                donated to charities and nonprofit organizations to help
                identify potential oral health concerns early and connect
                individuals, especially children, with licensed dental
                professionals when needed.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                This program exists to support charities working directly with
                underserved populations by giving them access to modern
                screening technology without cost barriers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-8 py-4 bg-[#4ebff7] text-white rounded-lg font-semibold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setShowPartnerModal(true)}
                >
                  Partner With Us
                </button>
                <button
                  onClick={() => {
                    const section = document.getElementById("support-children");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Donate Now
                </button>
              </div>
              <PartnerWithUsModal
                open={showPartnerModal}
                onClose={() => setShowPartnerModal(false)}
                program="charity"
              />
            </div>

            {/* Right Content - Mock Dashboard */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                {/* AI-Powered Badge */}
                <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-700">
                    Charity Program
                  </span>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      How It Works
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      3 Steps
                    </span>
                  </div>

                  {/* Workflow Image */}
                  <div className="mb-6">
                    <Image
                      src="/multicase.jpeg"
                      alt="DentalScan Workflow: Scan QR Code, Capture 5 Views, Get Results"
                      width={400}
                      height={240}
                      className="w-full h-auto rounded-lg"
                      priority
                    />
                  </div>

                  {/* Description */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Patients scan QR code → capture 5 dental views → receive
                      instant results with professional recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Program Exists */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why This Program Exists
            </h2>
            <p className="text-xl text-gray-600">
              Bridging the gap in preventive dental care for underserved
              communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Limited Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Many individuals served by charities lack consistent access to
                preventive dental care.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Emergency Only Care
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Children, families, and vulnerable populations often receive
                care only when pain or emergencies arise, long after early
                intervention could have helped.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Resource Barriers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Charities are on the front lines, but most do not have access to
                tools that allow for fast and scalable oral health screenings,
                structured documentation for follow up care, and secure
                workflows that respect privacy and dignity.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
              <p className="text-xl">
                DentalScan exists to support charities in closing that gap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Children at the Center */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Children at the Center of the Mission
            </h2>
            <p className="text-xl text-gray-600">
              Focusing on early intervention for the most vulnerable populations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Universal Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                While the Charity Program serves people of all ages, children
                are at the heart of this initiative.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Losing Coverage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Many children lose access to dental care as they grow due to
                changes in insurance coverage, financial hardship within
                families, and limited access to providers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Growing Problems
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Without early screening, small issues often turn into long term
                problems.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
              <p className="text-xl">
                DentalScan helps charities identify potential concerns earlier,
                giving children a better chance at timely professional care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What DentalScan Does */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What DentalScan Does for Charities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast and non-invasive oral health screenings using secure guided
              photo capture and AI-assisted analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Early Detection
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Identify areas that may require professional attention
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Secure Organization
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Organize screening data in a structured and secure format
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Simple Summaries
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Provide simple non-medical summaries for individuals
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Professional Reports
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate professional screening reports for licensed dental
                professionals
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">
                Transforming Care Approach
              </h3>
              <p className="text-xl">
                DentalScan allows charities to move from reactive care to early
                awareness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How the Charity Program Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure process designed for community outreach programs
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
              {/* Step 1 */}
              <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow relative">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Charity Facilitation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A charity facilitates the screening as part of its outreach or
                  community program
                </p>
                {/* Arrow - only visible on large screens */}
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow relative">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Photo Capture
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Individuals complete a guided oral photo capture using a
                  secure link or QR code
                </p>
                {/* Arrow */}
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-shadow relative">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  AI Analysis
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  DentalScan processes the submission using AI-assisted analysis
                </p>
                {/* Arrow */}
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow relative">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Dual Outputs
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Two outputs are generated: A simple wellness summary for the
                  individual, and a professional screening report for licensed
                  dental professionals when applicable
                </p>
                {/* Arrow */}
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  5
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Follow-up Care
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If follow-up is needed, individuals are referred to
                  appropriate dental care providers
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-gray-800 to-gray-600 px-8 py-4 rounded-xl text-white">
                <p className="text-lg font-semibold">
                  DentalScan does not diagnose, treat, or replace dental
                  professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What DentalScan Is and Is Not */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What DentalScan Is and Is Not
            </h2>
            <p className="text-xl text-gray-600">
              Understanding the role and limitations of preventive dental
              screening
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* DentalScan IS */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  DentalScan IS
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    A preventive screening and triage tool
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    A way to scale oral health awareness within charity programs
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    A support system for licensed dental professionals involved
                    in follow up care
                  </p>
                </div>
              </div>
            </div>

            {/* DentalScan IS NOT */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  DentalScan IS NOT
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">A diagnosis</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    A treatment plan
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Medical advice
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    A replacement for dental care
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] p-6 rounded-xl text-white">
              <p className="text-lg font-semibold">
                All clinical decisions remain the responsibility of licensed
                dental professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section
        id="support-children"
        className="py-20 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Support Children&apos;s Oral Health
            </h2>
            <p className="text-xl text-blue-100">
              Help us expand access to preventive dental screening for children
              in need
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Free for Charities
                  </h3>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  DentalScan is donated to qualifying charities at no cost.
                  Community donations help expand access and sustain
                  development.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    $5 supports 1 child
                  </h3>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Each contribution covers secure screening technology,
                  infrastructure, and program delivery through charitable
                  organizations.
                </p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-xl font-bold text-white text-center mb-6">
                Choose an amount to make an impact
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {donationAmounts.map((item) => (
                  <button
                    key={item.amount}
                    onClick={() => setSelectedAmount(item.amount)}
                    className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                      selectedAmount === item.amount
                        ? "bg-white text-[#4EBFF7] shadow-lg"
                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-xl font-bold mb-1">${item.amount}</div>
                    <div className="text-xs opacity-80">
                      {item.children} child{item.children > 1 ? "ren" : ""}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white font-semibold text-center placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
                <button className="px-8 py-3 bg-white text-[#4EBFF7] rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg transform hover:scale-105 border-2 border-white hover:border-blue-100">
                  💙 Donate Now
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-blue-100">
                  All donations are used exclusively to expand access to
                  preventive oral health screening for children through
                  charity-led programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Data Privacy and Responsible Use
            </h2>
            <p className="text-xl text-gray-600">
              DentalScan is built with privacy, security, and ethical use at its
              core
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Secure Encryption
              </h3>
              <p className="text-gray-600">
                Data is encrypted in transit and at rest
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Access Control
              </h3>
              <p className="text-gray-600">Access is role restricted</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                No Medical Diagnosis
              </h3>
              <p className="text-gray-600">
                End users do not receive medical diagnoses
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Professional Access
              </h3>
              <p className="text-gray-600">
                Professional screening reports are accessible only to authorized
                staff
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                HIPAA Aligned
              </h3>
              <p className="text-gray-600">
                Designed to support HIPAA aligned workflows when used with
                licensed providers
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-3">Responsible Technology</h3>
              <p className="text-lg">
                Responsible technology is essential when working with vulnerable
                populations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Partner With Us
            </h2>
            <p className="text-xl text-gray-600">
              Join us in expanding access to preventive dental care for
              underserved communities
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Active Partnership
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We are actively seeking partnerships with charities and
                nonprofit organizations serving underserved communities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Community Connection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                If your organization works directly with populations lacking
                access to preventive dental care, or if you know a charity that
                does, we would love to connect.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-12 py-4 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-xl font-bold text-xl hover:from-blue-600 hover:to-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => setShowPartnerModal(true)}
              >
                Partner with DentalScan
              </button>
              <button className="px-12 py-4 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-xl font-bold text-xl hover:from-blue-600 hover:to-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Introduce us to a charity organization
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-white">
                DentalScan for Charity Programs
              </h3>
              <p className="text-blue-100">
                is part of the DentalScan platform by ReplyQuick LLC
              </p>
            </div>
            <div className="border-t border-white/20 pt-6">
              <div className="flex justify-center space-x-6 mb-4">
                <Link
                  href="/dentalscan/privacy"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/dentalscan"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  DentalScan Platform
                </Link>
              </div>
              <p className="text-sm text-blue-100">
                © 2025 ReplyQuick LLC. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
