// src/app/sales/page.tsx
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function SalesPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [lastRecipientName, setLastRecipientName] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
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

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();

    try {
      const response = await fetch("/api/sales/send-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dentistName: trimmedName,
          dentistPhone: trimmedPhone,
          dentistEmail: trimmedEmail || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to send demo SMS");
      }

      setLastRecipientName(trimmedName);
      setShowSuccessModal(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error sending demo link:", error);
      setSubmissionError(
        "Failed to send demo link. Please check the details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              DentalScan – Demo Dashboard
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
              Not for medical use
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12">
          {/* Title Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Send DentalScan Demo
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              Share the power of AI-powered teledentistry
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              This demo link can be sent to anyone for evaluation. Not for
              medical use.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                  errors.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ebff7] focus:ring-opacity-50 ${
                  errors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-[#4ebff7] p-3 sm:p-4 rounded-r-lg">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-[#4ebff7]"
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
                  <p className="text-xs sm:text-sm text-gray-700">
                    A secure demo link will be sent via SMS to the phone number
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-white text-sm sm:text-lg transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4ebff7] hover:bg-[#3da8d9] hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                  <span className="text-xs sm:text-base">
                    Sending Demo Link...
                  </span>
                </span>
              ) : (
                "Send Demo Link"
              )}
            </button>

            {submissionError && (
              <p className="text-xs sm:text-sm text-red-600 mt-2 text-center">
                {submissionError}
              </p>
            )}
          </form>

          {/* Features Preview */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 text-center">
              What's included in the demo:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm text-gray-600">
                  AI-Powered Analysis
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm text-gray-600">
                  Remote Check-ins
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm text-gray-600">
                  Automated Claims
                </span>
              </div>
            </div>

            {/* Expiration Notice */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-4 sm:mt-6">
              Demo link valid for 30 days.
            </p>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 bg-opacity-95 transition-opacity"
            onClick={() => setShowSuccessModal(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
              <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100 mb-4 sm:mb-6">
                <svg
                  className="h-8 w-8 sm:h-10 sm:w-10 text-green-600"
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

              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Demo Link Sent!
                </h3>
                <p className="text-sm sm:text-lg text-gray-600 mb-2">
                  The DentalScan demo has been successfully sent to
                </p>
                <p className="text-lg sm:text-xl font-semibold text-[#4ebff7] mb-3 sm:mb-4">
                  {lastRecipientName || "the recipient"}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  This demo link can be used by dentists, investors, or general
                  users.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-semibold">Next Steps:</span> They will
                    receive an SMS with a secure link to explore DentalScan
                    features.
                  </p>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
                  This demo link expires in 30 days.
                </p>
                <p className="text-[10px] sm:text-xs text-amber-700 bg-amber-50 py-2 px-3 rounded-lg">
                  Demo mode only. Not for medical use.
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 px-4 sm:px-6 bg-[#4ebff7] hover:bg-[#3da8d9] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-200"
              >
                Send Another Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
