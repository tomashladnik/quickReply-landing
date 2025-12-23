"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FileText, Download, FolderOpen, BookOpen, FileCheck } from 'lucide-react';

export default function SalesDocsPage() {
  const [activeTab, setActiveTab] = useState('onboarding');

  const onboardingDocs = [
    {
      number: "01",
      title: "Product Positioning, Value, and Sales Guardrails",
      filename: "01-product-positioning.md.pdf",
      size: "112.00 KB",
      path: "/docs/01-product-positioning.md.pdf"
    },
    {
      number: "02",
      title: "Vertical Playbooks, Buyers, and Contract Strategy",
      filename: "02-vertical-playbooks.md.pdf",
      size: "217.26 KB",
      path: "/docs/02-vertical-playbooks.md.pdf"
    },
    {
      number: "03",
      title: "Demo Execution Playbook (How to Run Demos That Convert)",
      filename: "03-demo-execution-playbook.md.pdf",
      size: "115.67 KB",
      path: "/docs/03-demo-execution-playbook.md.pdf"
    },
    {
      number: "04",
      title: "Pilot Structure, Pricing Strategy, and Contract Conversion",
      filename: "04-pilot-and-pricing-framework.md.pdf",
      size: "118.50 KB",
      path: "/docs/04-pilot-and-pricing-framework.md.pdf"
    },
    {
      number: "05",
      title: "Compliance Language & Risk-Safe Positioning for Sales",
      filename: "05-compliance-language-for-sales.md.pdf",
      size: "95.82 KB",
      path: "/docs/05-compliance-language-for-sales.md.pdf"
    },
    {
      number: "06",
      title: "Objection Handling (Real DentalScan Objections & Approved Responses)",
      filename: "06-objection-handling.md.pdf",
      size: "105.13 KB",
      path: "/docs/06-objection-handling.md.pdf"
    },
    {
      number: "07",
      title: "Sales Process, Ownership, and Commission Flow",
      filename: "07-sales-process-and-commission-flow.md.pdf",
      size: "106.05 KB",
      path: "/docs/07-sales-process-and-commission-flow.md.pdf"
    },
    {
      number: "08",
      title: "Teledentistry Codes, Coverage Reality, Monitoring Use Cases, and Reimbursement Strategy",
      filename: "08-teledentistry-codes-coverage-and-monitoring.md.pdf",
      size: "133.34 KB",
      path: "/docs/08-teledentistry-codes-coverage-and-monitoring.md.pdf"
    },
    {
      number: "09",
      title: "Budget Reality & Spend Capacity by Vertical",
      filename: "09-budget-and-spend-by-vertical.md.pdf",
      size: "112.11 KB",
      path: "/docs/09-budget-and-spend-by-vertical.md.pdf"
    },
    {
      number: "10",
      title: "ROI Math, Deal Scenarios & Commission Upside",
      filename: "10-roi-math-and-commission-scenarios.md.pdf",
      size: "91.81 KB",
      path: "/docs/10-roi-math-and-commission-scenarios.md.pdf"
    }
  ];

  const agreementDocs = [
    {
      title: "DentalScan Agreement",
      filename: "DentalScan Agreement.pdf",
      size: "433.63 KB",
      path: "/agreements/DentalScan Agreement.pdf",
      description: "Standard client agreement template"
    },
    {
      title: "DentalScan Pilot Onboarding Intake Form",
      filename: "DentalScan Pilot Onboarding Intake Form.pdf",
      size: "381.32 KB",
      path: "/agreements/DentalScan Pilot Onboarding Intake Form.pdf",
      description: "Client intake form for pilot programs"
    },
    {
      title: "Internal Legal Rules for Sales",
      filename: "Internal Legal Rules for Sales.pdf",
      size: "45.35 KB",
      path: "/agreements/Internal Legal Rules for Sales.pdf",
      description: "Legal guidelines and compliance rules"
    }
  ];

  const handleDownload = (path: string, filename: string) => {
  // Create a link and trigger download
  const link = document.createElement('a');
  link.href = path;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Image
              src="/logo.png"
              alt="ReplyQuick"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span className="text-base sm:text-xl font-bold text-gray-900 whitespace-nowrap">
              DentalScan – Sales Documentation
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
              Internal Use Only
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Sales Team Resources
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Complete documentation for sales onboarding and client contracts
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-sm border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors duration-200 ${
                activeTab === 'onboarding'
                  ? 'text-[#4ebff7] border-b-2 border-[#4ebff7] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Onboarding Docs (10)</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('agreements')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors duration-200 ${
                activeTab === 'agreements'
                  ? 'text-[#4ebff7] border-b-2 border-[#4ebff7] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Agreements (3)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-2xl shadow-xl p-5 sm:p-8">
          {activeTab === 'onboarding' ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Sales Onboarding Documents
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Complete playbooks and guides for effective sales execution
                </p>
              </div>

              <div className="space-y-3">
                {onboardingDocs.map((doc) => (
                  <div
                    key={doc.number}
                    className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-[#4ebff7] hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-[#4ebff7] font-bold text-base sm:text-lg">
                          {doc.number}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            {doc.filename}
                          </span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(doc.path, doc.filename)}
                        className="shrink-0 px-3 sm:px-4 py-2 bg-[#4ebff7] hover:bg-[#3da8d9] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border-l-4 border-[#4ebff7] p-4 rounded-r-lg">
                <div className="flex">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-[#4ebff7]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      These documents are for internal use only. Review all materials before client interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Client Agreements & Forms
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Templates and forms for client onboarding and contracts
                </p>
              </div>

              <div className="space-y-3">
                {agreementDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-[#4ebff7] hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                          {doc.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            {doc.filename}
                          </span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(doc.path, doc.filename)}
                        className="shrink-0 px-3 sm:px-4 py-2 bg-[#4ebff7] hover:bg-[#3da8d9] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Legal Notice:</span> Review all agreements with legal counsel before sharing with clients. Ensure compliance with current regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-transparent hover:border-[#4ebff7] transition-colors duration-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-[#4ebff7]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Need Help?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Contact the sales team lead for document access or questions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-transparent hover:border-[#4ebff7] transition-colors duration-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Last Updated
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Documents updated December 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}