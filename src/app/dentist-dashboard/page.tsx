/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dentist-dashboard/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  dob: string;
}

interface Patient {
  id: string;
  patient_name: string;
  phone: string;
  email: string;
  status: "link-sent" | "submitted" | "completed" | string;
  created_at: string;
  analysisResult?: any;
}

function DentistDashboardClient() {
  // 🔹 Read query params from URL: /dentist-dashboard?demoId=...
  const searchParams = useSearchParams();
  const dentistId = searchParams.get("demoId") || ""; // this is the DemoDentist.id
  const dentistName = "Demo dentist"; // or from searchParams if you ever add it
  const expiresAtIso = ""; // if you later add ?expiresAt=... you can read it here

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [errors, setErrors] = useState<Partial<PatientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const expiresLabel = (() => {
    if (!expiresAtIso) return "30 days after activation";
    const d = new Date(expiresAtIso);
    if (Number.isNaN(d.getTime())) return "30 days after activation";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  })();

  // Fetch patients from API whenever dentistId changes
  useEffect(() => {
    if (!dentistId || dentistId === "undefined") {
      // nothing to fetch
      setPatients([]);
      setLoadingPatients(false);
      return;
    }
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dentistId]);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await fetch(
        `/api/demo/list?dentistId=${encodeURIComponent(dentistId)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data.scans || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("Failed to load patients");
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.dob.trim()) {
      newErrors.dob = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // 🔄 Uses dentistId from URL now
  const handleCreatePatient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!dentistId || dentistId === "undefined") {
      alert("Missing dentist id in URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dentist/create-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          dentistId, // backend knows which dentist
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data.error || "Failed to create patient");
      }

      // Close modal + reset form & errors
      setShowCreateModal(false);
      setFormData({ name: "", email: "", phone: "", dob: "" });
      setErrors({});

      alert(
        "Patient link sent via SMS. Ask your patient to open the link and complete the 5-step image submission."
      );

      // Refresh patient list
      fetchPatients();
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Failed to create patient: ${error?.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTopFindings = (analysis: any) => {
    if (!analysis || !Array.isArray(analysis.findings)) return [];
    return analysis.findings
      .filter((f: any) => typeof f?.confidence === "number")
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 3);
  };

  const dashboardMetrics = {
    totalPatients: patients.length,
    linksSent: patients.length,
    pending: patients.filter((p) => p.status !== "completed").length,
    completed: patients.filter((p) => p.status === "completed").length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "link_sent":
      case "link-sent":
        return {
          label: "link sent, awaiting images",
          class: "bg-yellow-100 text-yellow-700",
        };
      case "submitted":
        return {
          label: "photos received, pending result",
          class: "bg-blue-100 text-blue-700",
        };
      case "completed":
        return {
          label: "completed",
          class: "bg-green-100 text-green-700",
        };
      default:
        return {
          label: status,
          class: "bg-gray-100 text-gray-700",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="ReplyQuick" width={40} height={40} />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  DentalScan Dashboard
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full whitespace-nowrap">
                  Not for medical use
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Demo for{" "}
                <span className="font-semibold text-gray-800">
                  {dentistName}
                </span>{" "}
                • Expires on{" "}
                <span className="font-semibold text-gray-800">
                  {expiresLabel}
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#4ebff7]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardMetrics.totalPatients}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#4ebff7]"
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Links Sent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardMetrics.linksSent}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardMetrics.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardMetrics.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Patient
          </button>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Patient List
          </h2>

          {loadingPatients ? (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-[#4ebff7]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-3 text-gray-600">Loading patients...</span>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-4 text-gray-600">
                No patients yet. Create your first patient to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => {
                const statusInfo = getStatusInfo(patient.status);
                return (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Patient Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {patient.patient_name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {patient.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {patient.phone}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {formatDate(patient.created_at)}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.class}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* AI Analysis Summary */}
                    {patient.status === "completed" &&
                      patient.analysisResult &&
                      (() => {
                        const analysis = patient.analysisResult;
                        const topFindings = getTopFindings(analysis);

                        return (
                          <div className="mt-4 border rounded-lg p-4 bg-blue-50 border-blue-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              AI DentalScan Summary. This is a simulated demo
                              report. Not for medical use.
                            </h4>

                            {/* Overall + quality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                              <div>
                                <p className="text-gray-600 text-xs">
                                  Overall status
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {analysis.overall_status ?? "OK"}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-600 text-xs">
                                  Image quality
                                </p>
                                <p className="font-semibold text-gray-900">
                                  Score: {analysis.quality?.score ?? "–"}
                                </p>
                              </div>
                            </div>

                            {/* Findings */}
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                Key findings
                              </p>
                              {topFindings.length === 0 ? (
                                <p className="text-xs text-gray-600">
                                  No significant issues detected.
                                </p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {topFindings.map((f: any, idx: number) => (
                                    <span
                                      key={`${f.type}-${idx}`}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-[11px] bg-white border border-blue-200 text-blue-800"
                                    >
                                      {f.type}
                                      {typeof f.confidence === "number" && (
                                        <span className="ml-1 text-[10px] text-gray-500">
                                          ({Math.round(f.confidence * 100)}%)
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Recommendation */}
                            {Array.isArray(analysis.recommendations) &&
                              analysis.recommendations.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700 mb-1">
                                    Recommendation
                                  </p>
                                  <p className="text-xs text-gray-700">
                                    {analysis.recommendations[0]}
                                  </p>
                                </div>
                              )}
                          </div>
                        );
                      })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Patient Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowCreateModal(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Patient Profile
              </h3>

              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                      errors.dob
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        dob: "",
                      });
                      setErrors({});
                    }}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#4ebff7] hover:bg-[#3da8d9]"
                    }`}
                  >
                    {isSubmitting ? "Creating..." : "Scan Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DentistDashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <DentistDashboardClient />
    </Suspense>
  );
}