// src/app/multiusecase/charity/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Building2, Phone, MapPin, Heart, Shield } from "lucide-react";
import Image from "next/image";
type NoticeType = "success" | "error" | "info";

type Notification = {
  type: NoticeType;
  message: string;
} | null;

type AuthState = "checking" | "authorized" | "unauthorized";

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function CharitySignupPage() {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    organizationType: "charity",
    organizationName: "",
    ein: "",
    contactName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    populationServed: "",
    expectedScansPerMonth: "",
    programType: "",
    operationType: "",
    deadline: "",
    notes: "",
    privacyAccepted: false,
    charityAuthConfirmed: false,
    consentAuthorityConfirmed: false,
    nonMedicalUnderstanding: false,
    complianceResponsibility: false,
    technologyOnlyAcknowledged: false,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<Notification>(null);

  const usStates = useMemo(
    () => [
      { code: "AL", name: "Alabama" },
      { code: "AK", name: "Alaska" },
      { code: "AZ", name: "Arizona" },
      { code: "AR", name: "Arkansas" },
      { code: "CA", name: "California" },
      { code: "CO", name: "Colorado" },
      { code: "CT", name: "Connecticut" },
      { code: "DE", name: "Delaware" },
      { code: "FL", name: "Florida" },
      { code: "GA", name: "Georgia" },
      { code: "HI", name: "Hawaii" },
      { code: "ID", name: "Idaho" },
      { code: "IL", name: "Illinois" },
      { code: "IN", name: "Indiana" },
      { code: "IA", name: "Iowa" },
      { code: "KS", name: "Kansas" },
      { code: "KY", name: "Kentucky" },
      { code: "LA", name: "Louisiana" },
      { code: "ME", name: "Maine" },
      { code: "MD", name: "Maryland" },
      { code: "MA", name: "Massachusetts" },
      { code: "MI", name: "Michigan" },
      { code: "MN", name: "Minnesota" },
      { code: "MS", name: "Mississippi" },
      { code: "MO", name: "Missouri" },
      { code: "MT", name: "Montana" },
      { code: "NE", name: "Nebraska" },
      { code: "NV", name: "Nevada" },
      { code: "NH", name: "New Hampshire" },
      { code: "NJ", name: "New Jersey" },
      { code: "NM", name: "New Mexico" },
      { code: "NY", name: "New York" },
      { code: "NC", name: "North Carolina" },
      { code: "ND", name: "North Dakota" },
      { code: "OH", name: "Ohio" },
      { code: "OK", name: "Oklahoma" },
      { code: "OR", name: "Oregon" },
      { code: "PA", name: "Pennsylvania" },
      { code: "RI", name: "Rhode Island" },
      { code: "SC", name: "South Carolina" },
      { code: "SD", name: "South Dakota" },
      { code: "TN", name: "Tennessee" },
      { code: "TX", name: "Texas" },
      { code: "UT", name: "Utah" },
      { code: "VT", name: "Vermont" },
      { code: "VA", name: "Virginia" },
      { code: "WA", name: "Washington" },
      { code: "WV", name: "West Virginia" },
      { code: "WI", name: "Wisconsin" },
      { code: "WY", name: "Wyoming" },
    ],
    []
  );

  const showNotification = (type: NoticeType, message: string) => {
    setNotification({ type, message });
    window.setTimeout(
      () => setNotification(null),
      type === "success" ? 8000 : 5000
    );
  };

  // ✅ No localStorage/sessionStorage.
  // Access rules:
  // 1) If user came from your entrance flow (referrer), allow.
  // 2) Otherwise, require a valid server session (NextAuth) at /api/auth/session.
  useEffect(() => {
    let cancelled = false;

    async function checkAuthorization() {
      try {
        const referrer = document.referrer || "";
        const hasValidReferrer =
          referrer.includes("/entrance/dentalscan/select-organization") ||
          referrer.includes("/entrance/") ||
          referrer.includes("localhost:3000");

        if (hasValidReferrer) {
          if (!cancelled) setAuthState("authorized");
          return;
        }

        const res = await fetch("/api/auth/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelled) setAuthState("unauthorized");
          return;
        }

        const session = await res.json().catch(() => null);

        const sessionOrgType =
          session?.user?.orgType ||
          session?.user?.organizationType ||
          session?.orgType ||
          session?.organizationType;

        const authorized =
          String(sessionOrgType || "").toLowerCase() === "charity";

        if (!cancelled)
          setAuthState(authorized ? "authorized" : "unauthorized");
      } catch {
        if (!cancelled) setAuthState("unauthorized");
      }
    }

    checkAuthorization();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authState === "unauthorized") {
      router.replace("/entrance/dentalscan/select-organization");
    }
  }, [authState, router]);

  const handleCancel = () => {
    setFormData({
      organizationType: "charity",
      organizationName: "",
      ein: "",
      contactName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      populationServed: "",
      expectedScansPerMonth: "",
      programType: "",
      operationType: "",
      deadline: "",
      notes: "",
      privacyAccepted: false,
      charityAuthConfirmed: false,
      consentAuthorityConfirmed: false,
      nonMedicalUnderstanding: false,
      complianceResponsibility: false,
      technologyOnlyAcknowledged: false,
    });
    setError("");
    setNotification(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!isNonEmptyString(loginData.email)) {
        setError("Please enter your email address");
        return;
      }
      
      if (!isNonEmptyString(loginData.password)) {
        setError("Please enter your password");
        return;
      }

      const response = await fetch(`/api/multiusecase/register/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          organizationType: "charity",
        }),
      });

      const text = await response.text();
      const data = safeJsonParse(text) || {};

      if (response.ok) {
        if (data?.success && data?.organization) {
          const redirectId =
            data.organization.organizationId || data.organization.id;
          router.push(`/multiusecase/dashboard/${redirectId}`);
          return;
        }
        setError(data?.error || "Invalid credentials. Please try again.");
        return;
      }

      if (response.status === 404) {
        setError(
          "Organization not found. Please check your name or register a new account."
        );
        return;
      }

      setError(
        data?.error ||
          "Failed to verify organization information. Please try again."
      );
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateApplication = () => {
    if (!isNonEmptyString(formData.organizationName)) {
      showNotification("error", "Please enter your organization name");
      return false;
    }
    if (!isNonEmptyString(formData.ein)) {
      showNotification("error", "Please enter your EIN or registration number");
      return false;
    }
    if (!isNonEmptyString(formData.contactName)) {
      showNotification("error", "Please enter the contact person name");
      return false;
    }
    if (!isNonEmptyString(formData.email)) {
      showNotification("error", "Please enter your email address");
      return false;
    }
    if (!isValidEmail(formData.email)) {
      showNotification("error", "Please enter a valid email address");
      return false;
    }
    if (!isNonEmptyString(formData.phone)) {
      showNotification("error", "Please enter your phone number");
      return false;
    }
    if (digitsOnly(formData.phone).length < 10) {
      showNotification(
        "error",
        "Please enter a valid phone number with at least 10 digits"
      );
      return false;
    }
    if (!isNonEmptyString(formData.streetAddress)) {
      showNotification("error", "Please enter your organization address");
      return false;
    }
    if (!isNonEmptyString(formData.city)) {
      showNotification("error", "Please enter your city");
      return false;
    }
    if (!isNonEmptyString(formData.state)) {
      showNotification("error", "Please select your state");
      return false;
    }
    if (!isNonEmptyString(formData.zipCode)) {
      showNotification("error", "Please enter your ZIP code");
      return false;
    }
    if (digitsOnly(formData.zipCode).length !== 5) {
      showNotification("error", "Please enter a valid 5-digit ZIP code");
      return false;
    }
    if (!isNonEmptyString(formData.populationServed)) {
      showNotification("error", "Please select the population you serve");
      return false;
    }
    if (!isNonEmptyString(formData.expectedScansPerMonth)) {
      showNotification(
        "error",
        "Please select your expected monthly scan volume"
      );
      return false;
    }
    if (!isNonEmptyString(formData.programType)) {
      showNotification(
        "error",
        "Please select how you plan to run the program"
      );
      return false;
    }
    if (!isNonEmptyString(formData.operationType)) {
      showNotification("error", "Please select how you will run the program");
      return false;
    }
    if (!formData.privacyAccepted) {
      showNotification("error", "Please accept the privacy policy");
      return false;
    }
    if (!formData.charityAuthConfirmed) {
      showNotification(
        "error",
        "Please confirm your organization is legally authorized to operate charitable programs involving minors"
      );
      return false;
    }
    if (!formData.consentAuthorityConfirmed) {
      showNotification(
        "error",
        "Please confirm you have the authority to obtain necessary parental/guardian consents"
      );
      return false;
    }
    if (!formData.nonMedicalUnderstanding) {
      showNotification(
        "error",
        "Please confirm your understanding that this software provides non-diagnostic screenings only"
      );
      return false;
    }
    if (!formData.complianceResponsibility) {
      showNotification(
        "error",
        "Please accept responsibility for compliance with applicable laws"
      );
      return false;
    }
    if (!formData.technologyOnlyAcknowledged) {
      showNotification(
        "error",
        "Please acknowledge that ReplyQuick LLC provides technology only"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateApplication()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/multiusecase/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      const payload = safeJsonParse(text);

      if (!response.ok) {
        const msg =
          payload?.error || payload?.message || "Failed to submit application";
        throw new Error(msg);
      }

      handleCancel();
      showNotification(
        "success",
        "Thanks, we received your submission. Our team will review it and reach out with next steps."
      );
    } catch (err: any) {
      showNotification(
        "error",
        `Failed to submit application: ${err?.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authState !== "authorized") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4EBFF7]" />
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4EBFF7] opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 opacity-10 rounded-full blur-3xl" />
      </div>

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
                <Check className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
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
                    ? "Application Submitted!"
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

      <div className="relative w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-linear-to-br from-[#4EBFF7] to-cyan-500 p-12 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-white rounded-xl p-2 shadow-lg">
                    <Image
                      src="/ReplyQuick.jpeg"
                      alt="ReplyQuick Logo"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Charity Registration</h1>
                    <p className="text-sm text-blue-100">by ReplyQuick.ai</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  ❤️ Community Care
                  <br />
                  <span className="text-blue-100">Free Dental Screenings</span>
                </h2>

                <p className="text-blue-50 mb-8 text-lg leading-relaxed">
                  Empower your charity to provide free, accessible dental
                  screenings for underserved communities using AI technology.
                </p>

                <div className="space-y-3">
                  {[
                    "Free screenings for your community",
                    "Easy mobile access via QR codes",
                    "Secure, confidential results",
                    "Instant AI-powered analysis",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-blue-50"
                    >
                      <div className="bg-white bg-opacity-20 rounded-full p-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-8">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Heart className="w-4 h-4" />
                  <span>
                    Helping organizations serve their communities better
                  </span>
                </div>
              </div>
            </div>

            <div className="p-12">
              <div className="mb-8">
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      !isLogin
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Apply to Program
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isLogin
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {isLogin
                    ? "Access Your Charity Dashboard"
                    : "Community Care Program"}
                </h3>
                <p className="text-gray-500">
                  {isLogin
                    ? "Sign in to manage your organization's screening QR codes"
                    : "Apply to provide AI-powered dental screenings to your community"}
                </p>
                {!isLogin && (
                  <p className="text-sm text-gray-400 mt-1">
                    Participation is subject to review and availability.
                    Approved organizations may be offered donated, subsidized,
                    or paid access depending on program availability.
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {isLogin ? (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="loginEmail"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="loginEmail"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors"
                      placeholder="contact@organization.org"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="loginPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Password *
                    </label>
                    <input
                      type="password"
                      id="loginPassword"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#4EBFF7] to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-500 hover:to-[#4EBFF7] focus:outline-none focus:ring-2 focus:ring-[#4EBFF7] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Signing In...
                      </div>
                    ) : (
                      "Access Charity Dashboard"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.organizationName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organizationName: e.target.value,
                          })
                        }
                        placeholder="Community Health Foundation"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      EIN / Registration Number *
                    </label>
                    <input
                      type="text"
                      value={formData.ein}
                      onChange={(e) =>
                        setFormData({ ...formData, ein: e.target.value })
                      }
                      placeholder="12-3456789 or Registration #"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactName: e.target.value,
                        })
                      }
                      placeholder="Jane Smith, Program Director"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="contact@organization.org"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(
                            /[^\d\s\-\(\)]/g,
                            ""
                          );
                          setFormData({ ...formData, phone: value });
                        }}
                        placeholder="(555) 123-4567"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            streetAddress: e.target.value,
                          })
                        }
                        placeholder="123 Community Drive"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder="City"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                      >
                        <option value="">Select State</option>
                        {usStates.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 5);
                        setFormData({ ...formData, zipCode: value });
                      }}
                      placeholder="12345"
                      maxLength={5}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Population Served *
                    </label>
                    <select
                      value={formData.populationServed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          populationServed: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    >
                      <option value="">Select Population</option>
                      <option value="youth">Youth / Children</option>
                      <option value="foster">Foster Children</option>
                      <option value="seniors">Seniors</option>
                      <option value="homeless">Homeless Population</option>
                      <option value="veterans">Veterans</option>
                      <option value="low-income">Low-Income Families</option>
                      <option value="refugees">Refugees/Immigrants</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expected Monthly Scans *
                    </label>
                    <select
                      value={formData.expectedScansPerMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedScansPerMonth: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    >
                      <option value="">Select Volume</option>
                      <option value="1-10">1-10 scans</option>
                      <option value="11-25">11-25 scans</option>
                      <option value="26-50">26-50 scans</option>
                      <option value="51-100">51-100 scans</option>
                      <option value="100+">100+ scans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Program Type *
                    </label>
                    <select
                      value={formData.programType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          programType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    >
                      <option value="">Select Program Type</option>
                      <option value="onsite-day">One-time On-site Event</option>
                      <option value="recurring-events">Recurring Events</option>
                      <option value="ongoing-program">Ongoing Program</option>
                      <option value="mobile-outreach">Mobile Outreach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Launch Date{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      How will you run the program? *
                    </label>
                    <select
                      value={formData.operationType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          operationType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700"
                    >
                      <option value="">Select Operation Type</option>
                      <option value="onsite-events">On-site events/days</option>
                      <option value="ongoing-program">Ongoing program</option>
                      <option value="mobile-outreach">Mobile outreach</option>
                      <option value="community-center">
                        At community center
                      </option>
                      <option value="partnered-clinic">
                        Partnered with clinic
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Any additional information about your program, special requirements, or questions..."
                      rows={4}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none text-gray-700 resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            privacyAccepted: e.target.checked,
                          })
                        }
                        className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-[#4EBFF7] focus:ring-2 focus:ring-[#4EBFF7] focus:ring-offset-0 cursor-pointer"
                      />
                      <label
                        htmlFor="privacy"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        I agree to the{" "}
                        <a
                          href="/legal/terms"
                          className="text-[#4EBFF7] font-semibold hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/legal/privacy"
                          className="text-[#4EBFF7] font-semibold hover:underline"
                        >
                          Privacy Policy
                        </a>
                        . I confirm that I have the authority to create this
                        account on behalf of my organization.
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      Charity Authorization & Responsibility Confirmation
                    </h4>
                    <p className="text-sm text-amber-800 mb-4">
                      As a charitable organization working with minors, please
                      confirm the following requirements:
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="charityAuth"
                          checked={formData.charityAuthConfirmed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              charityAuthConfirmed: e.target.checked,
                            })
                          }
                          className="mt-1 w-5 h-5 rounded border-2 border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <label
                          htmlFor="charityAuth"
                          className="text-sm text-amber-900 cursor-pointer"
                        >
                          We confirm that our organization is{" "}
                          <span className="font-semibold">
                            legally authorized to operate charitable programs
                            involving minors
                          </span>
                          .
                        </label>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="consentAuth"
                          checked={formData.consentAuthorityConfirmed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              consentAuthorityConfirmed: e.target.checked,
                            })
                          }
                          className="mt-1 w-5 h-5 rounded border-2 border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <label
                          htmlFor="consentAuth"
                          className="text-sm text-amber-900 cursor-pointer"
                        >
                          We confirm that we have obtained, and maintain on
                          record, all required{" "}
                          <span className="font-semibold">
                            parental or legal guardian consents permitting
                            minors to participate in non-clinical health
                            screenings
                          </span>{" "}
                          conducted through this software.
                        </label>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="nonMedical"
                          checked={formData.nonMedicalUnderstanding}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nonMedicalUnderstanding: e.target.checked,
                            })
                          }
                          className="mt-1 w-5 h-5 rounded border-2 border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <label
                          htmlFor="nonMedical"
                          className="text-sm text-amber-900 cursor-pointer"
                        >
                          We understand that this software provides{" "}
                          <span className="font-semibold">
                            non-diagnostic, informational screenings only
                          </span>{" "}
                          and does not provide medical advice, diagnosis, or
                          treatment.
                        </label>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="compliance"
                          checked={formData.complianceResponsibility}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              complianceResponsibility: e.target.checked,
                            })
                          }
                          className="mt-1 w-5 h-5 rounded border-2 border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <label
                          htmlFor="compliance"
                          className="text-sm text-amber-900 cursor-pointer"
                        >
                          We accept{" "}
                          <span className="font-semibold">
                            responsibility for program-level compliance with all
                            applicable laws
                          </span>{" "}
                          related to minors, consent, and participant privacy in
                          connection with our use of this software.
                        </label>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="techOnly"
                          checked={formData.technologyOnlyAcknowledged}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              technologyOnlyAcknowledged: e.target.checked,
                            })
                          }
                          className="mt-1 w-5 h-5 rounded border-2 border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <label
                          htmlFor="techOnly"
                          className="text-sm text-amber-900 cursor-pointer"
                        >
                          We acknowledge that{" "}
                          <span className="font-semibold">
                            ReplyQuick LLC provides technology only
                          </span>{" "}
                          and is not responsible for program operations or
                          participant consent.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-[#4EBFF7] to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-500 hover:to-[#4EBFF7] focus:outline-none focus:ring-2 focus:ring-[#4EBFF7] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Registering...
                        </div>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4EBFF7]" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#4EBFF7]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#4EBFF7]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Privacy-First Design</span>
          </div>
        </div>
      </div>
    </div>
  );
}
