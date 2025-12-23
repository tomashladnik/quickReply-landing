"use client";

import Link from "next/link";
import DentalScanNav from "../../components/DentalScanNav";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <DentalScanNav activePage="privacy" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            DentalScan Privacy and Compliance
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Data Protection, Security, and Regulatory Alignment
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            DentalScan is built with a strong focus on data protection, security, and regulatory compliance.
            The platform is designed to support preventive screening and awareness workflows while
            maintaining strict controls over data access, storage, and transmission.
          </p>
          <p className="text-lg text-gray-600 mt-6">
            This page outlines how DentalScan handles data and the standards it follows across different
            regions and use cases.
          </p>
        </div>
      </section>

      {/* Compliance Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Compliance Overview
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            DentalScan is designed to align with applicable data protection and healthcare regulations across
            multiple regions.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            The platform supports compliant workflows for:
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              HIPAA compliance across all 50 states in the United States
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              GDPR compliance for applicable European Union requirements
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Data protection standards across North and South America, based on local regulatory expectations
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            DentalScan does not act as a healthcare provider. When used with licensed dental professionals,
            it supports compliant handling of protected health information within regulated workflows.
          </p>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Data Security
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            DentalScan uses industry standard security practices to protect all data processed through the
            platform.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Security measures include:
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Encryption of data in transit and at rest
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Secure cloud infrastructure
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Controlled access to systems and data
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Ongoing monitoring and security reviews
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            Security controls are designed to scale with the platform and adapt as requirements evolve.
          </p>
        </div>
      </section>

      {/* Access Control and Data Segmentation */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Access Control and Data Segmentation
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Access to data within DentalScan is restricted based on role, program type, and authorization level.
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Role based access controls are enforced
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Administrative access is limited and logged
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Data is segmented by organization and use case
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Audit mechanisms are in place for authorized activity
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            Only authorized users can access specific data relevant to their role.
          </p>
        </div>
      </section>

      {/* Data Usage and Purpose Limitation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Data Usage and Purpose Limitation
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            DentalScan collects and processes data only for the purposes required to deliver its intended functionality.
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Data is not collected unnecessarily
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Data is not sold or shared with third parties for unrelated purposes
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Processing is limited to screening, awareness, and workflow support
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            Use of data is purpose bound and context specific.
          </p>
        </div>
      </section>

      {/* Screening, Not Diagnosis */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Screening, Not Diagnosis
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            DentalScan is a screening and awareness platform.
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              It does not provide medical diagnoses
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              It does not prescribe treatment
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              It does not replace licensed dental professionals
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            Any clinical decisions or treatment planning remain the responsibility of licensed providers using
            their professional judgment.
          </p>
        </div>
      </section>

      {/* HIPAA Aligned Workflows */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            HIPAA Aligned Workflows
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            When DentalScan is used in conjunction with licensed dental professionals, workflows are
            designed to align with HIPAA requirements.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            These include:
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Secure handling of protected health information
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Encrypted data storage and transmission
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Role based access and authorization
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Separation between user facing outputs and professional reports
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            DentalScan supports compliance but does not assume provider responsibility.
          </p>
        </div>
      </section>

      {/* Data Retention and Storage */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Data Retention and Storage
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Data retention policies are designed to balance operational needs, regulatory requirements, and
            security best practices.
          </p>
          <ul className="space-y-3 text-lg text-gray-600 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Data is stored only as long as necessary for supported workflows
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Retention periods may vary based on organization, region, and use case
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-[#4EBFF7] rounded-full flex-shrink-0 mr-4 mt-1"></div>
              Secure deletion processes are applied when data is no longer required
            </li>
          </ul>
          <p className="text-lg text-gray-600">
            Organizations using DentalScan remain responsible for their own regulatory obligations.
          </p>
        </div>
      </section>

      {/* Transparency and Accountability */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Transparency and Accountability
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            DentalScan is committed to transparency in how data is handled and protected.
          </p>
          <p className="text-lg text-gray-600">
            If you have questions regarding data security, compliance, or platform usage, additional
            documentation can be provided upon request.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-blue-100 mb-4">
              DentalScan is a product of ReplyQuick LLC.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <Link href="/dentalscan/schools" className="text-blue-100 hover:text-white transition-colors">
                Schools
              </Link>
              <Link href="/dentalscan/charity" className="text-blue-100 hover:text-white transition-colors">
                Charity
              </Link>
              <Link href="/dentalscan/gym" className="text-blue-100 hover:text-white transition-colors">
                Gym
              </Link>
              <Link href="/dentalscan" className="text-blue-100 hover:text-white transition-colors">
                DentalScan Platform
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}