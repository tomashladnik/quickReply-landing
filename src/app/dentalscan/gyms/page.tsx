"use client";

import { useState } from "react";
import PartnerWithUsModal from "../PartnerWithUsModal";
import Image from "next/image";
import Link from "next/link";
import DentalScanNav from "../../components/DentalScanNav";

export default function GymsPage() {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <DentalScanNav activePage="gyms" />

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
                DentalScan for <span className="block text-[#4EBFF7]">Gyms & Wellness</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Cosmetic Whitening Awareness for Members
              </p>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                DentalScan is an AI powered tooth whitening assessment tool designed for gyms, fitness
                studios, and wellness centers that want to offer a cosmetic, confidence focused experience for
                their members.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                This program is built specifically around whitening awareness, not medical screening, allowing
                gyms to add value without introducing clinical complexity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-8 py-4 bg-[#4ebff7] text-white rounded-lg font-semibold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setShowPartnerModal(true)}
                >
                  Partner with DentalScan
                </button>
                <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Learn More About Whitening Programs
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
                    Wellness Program
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
                      src="/gym.jpeg"
                      alt="Gym Whitening Assessment Workflow"
                      width={400}
                      height={240}
                      className="w-full h-auto rounded-lg"
                      priority
                    />
                  </div>

                  {/* Description */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Members scan QR code → capture tooth photos → receive cosmetic whitening assessment with confidence insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PartnerWithUsModal open={showPartnerModal} onClose={() => setShowPartnerModal(false)} />

      {/* Why Whitening Fits in Wellness */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Whitening Fits in Wellness
            </h2>
            <p className="text-xl text-gray-600">
              Confidence, appearance, and self care are core motivations for people who invest in fitness and wellness
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Tooth Shade</h3>
              <p className="text-gray-600">
                Many people have no clear way to understand their current tooth shade and baseline
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Whitening Effectiveness</h3>
              <p className="text-gray-600">
                Whether whitening may be effective for their specific tooth condition and goals
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Results Improvement</h3>
              <p className="text-gray-600">
                How their results could improve with whitening treatments and expected outcomes
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Ideal Wellness Environment</h3>
              <p className="text-xl leading-relaxed mb-4">
                Gyms and wellness centers are ideal environments for cosmetic awareness, where members are
                already focused on improving how they look and feel.
              </p>
              <p className="text-lg opacity-95">
                DentalScan provides a simple, non invasive way to support that experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What DentalScan Does for Gyms */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What DentalScan Does for Gyms
            </h2>
            <p className="text-xl text-gray-600">
              DentalScan enables a fast whitening scan using guided photo capture and AI assisted analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Assess Current Tooth Shade</h3>
              <p className="text-gray-600">
                Precise shade analysis using AI-powered assessment technology
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Whitening Score</h3>
              <p className="text-gray-600">
                Clear whitening score or range with potential improvement metrics
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Visual Improvement</h3>
              <p className="text-gray-600">
                Show potential cosmetic improvement visually through clear reports
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Support Conversations</h3>
              <p className="text-gray-600">
                Enable whitening focused conversations and wellness programs
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <p className="text-xl font-medium">
              No medical conditions, no disease indicators, and no clinical judgments are included.
            </p>
          </div>
        </div>
      </section>

      {/* How the Whitening Program Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How the Whitening Program Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: "1",
                title: "Gym Offers DentalScan",
                description: "A gym or wellness center offers DentalScan as a cosmetic add on or wellness activation"
              },
              {
                step: "2", 
                title: "Member Photo Capture",
                description: "Members complete a guided tooth photo capture using a secure link or QR code"
              },
              {
                step: "3",
                title: "AI Analysis",
                description: "DentalScan analyzes tooth shade and whitening potential using advanced AI"
              },
              {
                step: "4",
                title: "Cosmetic Report",
                description: "Members receive a whitening focused cosmetic report, not a medical report"
              },
              {
                step: "5",
                title: "Independent Choice",
                description: "Members may choose to pursue whitening options independently if they wish"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-gray-900">
              DentalScan does not diagnose, detect disease, or provide medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* What Members See */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What Members See
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Members receive a comprehensive, positive-focused report that builds confidence and motivation:
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Personalized Shade Score</h3>
                    <p className="text-gray-600">Whitening score and current shade assessment</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Visual Improvement</h3>
                    <p className="text-gray-600">Before/after visual showing potential whitening results</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Confidence Insights</h3>
                    <p className="text-gray-600">Cosmetic-focused recommendations and insights</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-linear-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-green-800 font-medium">
                    No cavities, no gum disease, no negative health flags
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Sample Member Report</h3>
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <Image
                  src="/gymresult.jpeg"
                  alt="Sample DentalScan Whitening Assessment Report showing Current Shade B2, Whitening Potential 2-3 Shades, and Excellent Confidence Score"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
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
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                DentalScan IS
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A cosmetic whitening awareness tool</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A confidence focused experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A value add for premium fitness and wellness brands</span>
                </li>
              </ul>
            </div>

            {/* DentalScan IS NOT */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                DentalScan IS NOT
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A medical screening</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A diagnosis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A treatment recommendation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">A replacement for dental care</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-white">
              <p className="text-xl font-medium">
                Gyms and wellness centers never take on clinical responsibility.
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
              Privacy and Responsible Use
            </h2>
            <p className="text-xl text-gray-600">
              DentalScan is built with privacy and responsible use in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Encryption</h3>
              <p className="text-gray-600">
                Data is encrypted in transit and at rest
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Control</h3>
              <p className="text-gray-600">
                Access is role restricted
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">No Medical Data</h3>
              <p className="text-gray-600">
                No medical data or diagnoses are provided
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cosmetic Focus</h3>
              <p className="text-gray-600">
                Designed for cosmetic, non clinical use cases
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <p className="text-xl font-medium">
              Member privacy and comfort are always prioritized.
            </p>
          </div>
        </div>
      </section>

      {/* Partner With DentalScan */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Partner With DentalScan
            </h2>
            <p className="text-xl text-gray-600">
              We are actively working with premium wellness organizations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Boutique Fitness Studios</h3>
              <p className="text-gray-600 text-sm">
                Premium fitness experiences with cosmetic wellness focus
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pilates and Yoga Centers</h3>
              <p className="text-gray-600 text-sm">
                Mind-body wellness with holistic confidence enhancement
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Premium Wellness Brands</h3>
              <p className="text-gray-600 text-sm">
                Luxury wellness experiences with advanced technology
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-12 h-12 bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">High End Gyms</h3>
              <p className="text-gray-600 text-sm">
                Elite fitness facilities with comprehensive member services
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-[#4EBFF7] to-[#35A3E8] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Enhance Member Experience?</h3>
            <p className="text-xl mb-8 opacity-95">
              If your organization is exploring ways to enhance member experience through cosmetic wellness
              technology, we would love to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-white text-[#4ebff7] rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg transform hover:scale-105"
                onClick={() => setShowPartnerModal(true)}
              >
                Partner with DentalScan
              </button>
              <button className="px-8 py-4 bg-white/20 text-white border border-white rounded-lg font-semibold text-lg hover:bg-white/30 transition-all">
                Learn more about whitening programs
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
              <h3 className="text-2xl font-bold mb-2 text-white">DentalScan for Gyms and Wellness Centers</h3>
              <p className="text-blue-100">
                is part of the DentalScan platform by ReplyQuick LLC
              </p>
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