// src/app/dentalscan/schools/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import DentalScanNav from "../../components/DentalScanNav";
import { useState } from "react";
import PartnerWithUsModal from "../PartnerWithUsModal";

export default function SchoolsPage() {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <DentalScanNav activePage="schools" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-linear-to-b from-blue-50 to-white">
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
                DentalScan for{" "}
                <span className="block text-[#4EBFF7]">Schools</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Preventive Oral Health Screening for Students
              </p>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                DentalScan is an AI powered oral health screening platform
                designed to support schools and educational programs by
                providing early oral health awareness for students and helping
                identify potential concerns before they become serious issues.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The goal is simple: support students with preventive screening
                and connect families to professional care when needed, without
                turning schools into healthcare providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-8 py-4 bg-[#4ebff7] text-white rounded-lg font-semibold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setShowPartnerModal(true)}
                >
                  Partner with DentalScan
                </button>
                <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Learn More About School Programs
                </button>
              </div>
            </div>
            {/* Right Content - Mock Dashboard */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                {/* AI-Powered Badge */}
                <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-700">
                    School Program
                  </span>
                </div>
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      How It Works
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Simple Process
                    </span>
                  </div>
                  {/* Workflow Image */}
                  <div className="mb-6">
                    <Image
                      src="/school.jpeg"
                      alt="School Health Screening Workflow"
                      width={400}
                      height={240}
                      className="w-full h-auto rounded-lg"
                      priority
                    />
                  </div>
                  {/* Description */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Students scan QR code → capture oral health photos →
                      receive preventive screening with family-friendly insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PartnerWithUsModal
        open={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        program="charity"
      />

      {/* Why Schools Matter */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Schools Matter
            </h2>
            <p className="text-xl text-gray-600">
              For many children, school is the most consistent point of contact
              with structured programs and adult oversight
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                Consistent Contact
              </h3>
              <p className="text-gray-600">
                School provides the most reliable touchpoint for structured
                health awareness programs
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Decreasing Care Access
              </h3>
              <p className="text-gray-600">
                Access to preventive dental care often decreases as children
                grow older, making early detection crucial
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Bridging the Gap
              </h3>
              <p className="text-gray-600">
                Schools are uniquely positioned to support early awareness for
                students without regular dental care access
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">
                Responsible Gap Filling
              </h3>
              <p className="text-xl leading-relaxed mb-4">
                Schools are uniquely positioned to support early awareness,
                especially for students who may not have regular access to
                dental care outside the school system.
              </p>
              <p className="text-lg opacity-95">
                DentalScan exists to help schools fill this gap responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What DentalScan Does for Schools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What DentalScan Does for Schools
            </h2>
            <p className="text-xl text-gray-600">
              DentalScan enables fast and non-invasive oral health screenings
              using secure, guided photo capture and AI-assisted analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                Identify Concerns
              </h3>
              <p className="text-gray-600">
                Identify areas that may require professional attention through
                AI-assisted screening
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Family Summaries
              </h3>
              <p className="text-gray-600">
                Provide simple, non-medical summaries for students and families
                to promote awareness
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Professional Reports
              </h3>
              <p className="text-gray-600">
                Generate structured screening data for licensed dental
                professionals when follow-up is needed
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Appropriate Boundaries
              </h3>
              <p className="text-gray-600">
                Support early awareness without disrupting the school
                environment while maintaining boundaries
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">
                DentalScan allows schools to promote preventive health
              </h3>
              <p className="text-xl leading-relaxed">
                while staying within appropriate boundaries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How the School Program Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How the School Program Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure process designed for school environments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                School Facilitation
              </h3>
              <p className="text-gray-600">
                A school facilitates the screening as part of a health,
                wellness, or preventive program
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Secure Capture
              </h3>
              <p className="text-gray-600">
                Students complete guided oral photo capture using a secure link
                or QR code, with appropriate consent
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                AI Analysis
              </h3>
              <p className="text-gray-600">
                DentalScan processes the submission using AI-assisted analysis
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dual Outputs
              </h3>
              <p className="text-gray-600">
                A simple wellness summary for the student and family, and a
                professional screening report when applicable
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-white">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Professional Care
              </h3>
              <p className="text-gray-600">
                Families are encouraged to seek professional dental care if
                follow-up is recommended
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Important Note</h3>
              <p className="text-xl leading-relaxed">
                DentalScan does not diagnose, treat, or replace dental
                professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What DentalScan Is and Is Not */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What DentalScan Is and Is Not
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* DentalScan IS */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <svg
                  className="w-8 h-8 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                DentalScan IS
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    A preventive screening and awareness tool
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    A way to identify potential concerns early
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    A support system for families and licensed dental
                    professionals
                  </span>
                </li>
              </ul>
            </div>

            {/* DentalScan IS NOT */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <svg
                  className="w-8 h-8 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                DentalScan IS NOT
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">A diagnosis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">A treatment plan</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Medical advice</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg
                      className="w-3 h-3 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    A replacement for dental care
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-white">
              <p className="text-xl font-medium">
                Schools are never responsible for clinical decisions. All
                medical judgment remains with licensed dental professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Responsible Use */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy and Responsible Use in Schools
            </h2>
            <p className="text-xl text-gray-600">
              DentalScan is built with privacy, security, and ethical use in
              mind, especially when working with children
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
                Data Encryption
              </h3>
              <p className="text-gray-600">
                Data is encrypted in transit and at rest
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
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
              <p className="text-gray-600">
                Access is role restricted to authorized personnel only
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
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

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Policy Respect
              </h3>
              <p className="text-gray-600">
                Respects school policies, family consent, and data protection
                requirements
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Built for Schools</h3>
              <p className="text-xl leading-relaxed mb-4">
                DentalScan respects school policies, family consent, and data
                protection requirements.
              </p>
              <p className="text-lg opacity-95">
                Our platform is designed specifically for educational
                environments with appropriate safeguards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner With DentalScan */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Partner With DentalScan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We are actively working with schools and educational programs
            interested in supporting preventive oral health awareness for
            students.
          </p>
          <p className="text-lg text-gray-600 mb-12">
            If your school or district is exploring ways to promote early dental
            health awareness while maintaining appropriate boundaries, we would
            love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 bg-[#4ebff7] text-white rounded-lg font-semibold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setShowPartnerModal(true)}
            >
              Partner with DentalScan
            </button>
            <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Learn More About School Programs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-white">
                DentalScan for Schools
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
