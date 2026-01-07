// src/app/multiusecase/charity/setup/page.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CharitySetupContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const hasLoadedData = useRef(false);

  // Show notification popup
  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), type === "success" ? 8000 : 5000);
  };

  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Only fetch once using ref to prevent infinite loop
    if (hasLoadedData.current) return;
    hasLoadedData.current = true;

    // Fetch organization data from backend to pre-populate all fields
    const fetchOrganizationData = async () => {
      const email = searchParams.get("email");
      const org = searchParams.get("org");

      if (!email || !org) {
        return;
      }

      try {
        const response = await fetch(
          `/api/multiusecase/charity/setup?email=${encodeURIComponent(
            email
          )}&org=${encodeURIComponent(org)}`
        );
        const data = await response.json();

        if (response.ok) {
          setFormData((prev) => ({
            ...prev,
            organizationName: data.organizationName || "",
            email: data.email || "",
            phone: data.phone || "",
          }));
        } else {
          showNotification(
            "error",
            "Could not load organization data: " + data.error
          );
          // Fallback to URL params
          setFormData((prev) => ({
            ...prev,
            email: decodeURIComponent(email),
            organizationName: decodeURIComponent(org),
          }));
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        showNotification("error", "Could not load organization data");
        // Fallback to URL params
        setFormData((prev) => ({
          ...prev,
          email: decodeURIComponent(email),
          organizationName: decodeURIComponent(org),
        }));
      }
    };

    fetchOrganizationData();
  }, []); // Empty dependency array - only run once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.organizationName.trim()) {
      showNotification("error", "Please enter your organization name");
      return;
    }
    if (!formData.email.trim()) {
      showNotification("error", "Please enter your email address");
      return;
    }
    if (!formData.phone.trim()) {
      showNotification("error", "Please enter your phone number");
      return;
    }
    if (!formData.password.trim()) {
      showNotification("error", "Please enter a password");
      return;
    }
    if (formData.password.length < 6) {
      showNotification("error", "Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification("error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/multiusecase/charity/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: formData.organizationName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set up account");
      }

      setSetupComplete(true);
      showNotification(
        "success",
        "Account setup complete! You can now log in to your dashboard."
      );
    } catch (error: any) {
      console.error("Setup error:", error);
      showNotification("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
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

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Setup Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Your charity account has been successfully set up. You can now log
            in to access your dashboard.
          </p>

          <a
            href="/multiusecase/charity"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`p-6 rounded-xl shadow-2xl max-w-md border ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : notification.type === "error"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <svg
                  className="w-6 h-6 text-green-600 mt-0.5 shrink-0"
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
              ) : notification.type === "error" ? (
                <svg
                  className="w-6 h-6 text-red-600 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-blue-600 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div>
                <h4
                  className={`font-semibold text-sm ${
                    notification.type === "success"
                      ? "text-green-900"
                      : notification.type === "error"
                      ? "text-red-900"
                      : "text-blue-900"
                  }`}
                >
                  {notification.type === "success"
                    ? "Success!"
                    : notification.type === "error"
                    ? "Error"
                    : "Information"}
                </h4>
                <p className="text-sm leading-relaxed mt-1">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Account Setup
          </h1>
          <p className="text-gray-600">
            Your charity application has been approved! Please set up your
            account to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              placeholder="Enter your organization name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Create Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              placeholder="Create a secure password"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? "Setting up account..." : "Complete Setup"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/multiusecase/charity"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CharitySetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4EBFF7]"></div>
              <p className="text-gray-600">Loading setup...</p>
            </div>
          </div>
        </div>
      }
    >
      <CharitySetupContent />
    </Suspense>
  );
}
