// src/app/multiusecase/gym/page.tsx
"use client";

import React, { useState } from "react";
import { Check, Building2, Phone, MapPin, Shield, Mail } from "lucide-react";
import Image from "next/image";

export default function GymSignupPage() {
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    organizationType: "gym",
    organizationName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const usStates = [
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
  ];

  const handleCancel = () => {
    setFormData({
      organizationType: "gym",
      organizationName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      password: "",
      termsAccepted: false,
      privacyAccepted: false,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!loginData.email.trim()) {
        setError("Please enter your email address");
        setIsLoading(false);
        return;
      }
      if (!loginData.password.trim()) {
        setError("Please enter your password");
        setIsLoading(false);
        return;
      }
      const response = await fetch(`/api/multiusecase/register/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          organizationType: "gym",
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data?.success && data?.organization) {
        const redirectId =
          data.organization.organizationId || data.organization.id;
        window.location.replace(`/multiusecase/dashboard/${redirectId}`);
        return;
      }

      setError(data?.error || "Invalid credentials. Please try again.");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.organizationName.trim()) {
      showNotification("error", "Please enter your gym name");
      return;
    }
    if (!formData.phone.trim()) {
      showNotification("error", "Please enter your phone number");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      showNotification(
        "error",
        "Please enter a valid phone number with at least 10 digits"
      );
      return;
    }

    if (!formData.email.trim()) {
      showNotification("error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification("error", "Please enter a valid email address");
      return;
    }

    if (!formData.streetAddress.trim()) {
      showNotification("error", "Please enter your gym address");
      return;
    }
    if (!formData.city.trim()) {
      showNotification("error", "Please enter your city");
      return;
    }
    if (!formData.state) {
      showNotification("error", "Please select your state");
      return;
    }
    if (!formData.zipCode.trim()) {
      showNotification("error", "Please enter your ZIP code");
      return;
    }
    if (formData.zipCode.length !== 5) {
      showNotification("error", "Please enter a valid 5-digit ZIP code");
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
    if (!formData.termsAccepted) {
      showNotification("error", "Please accept the terms of service");
      return;
    }
    if (!formData.privacyAccepted) {
      showNotification("error", "Please accept the privacy policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/multiusecase/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => any);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to register gym");
      }

      const redirectId =
        data?.organization?.organizationId || data?.organization?.id;
      if (!redirectId)
        throw new Error("Registration succeeded but redirect id missing");

      window.location.replace(`/multiusecase/qr-codes?orgId=${redirectId}`);
    } catch (error: any) {
      console.error("Error registering gym:", error);
      showNotification("error", `Failed to register gym: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4EBFF7] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 opacity-10 rounded-full blur-3xl"></div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`p-4 rounded-lg shadow-lg max-w-md ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-linear-to-br from-[#4EBFF7] to-cyan-500 p-12 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

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
                    <h1 className="text-2xl font-bold">Gym Registration</h1>
                    <p className="text-sm text-blue-100">by ReplyQuick.ai</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  💪 Fitness & Wellness
                  <br />
                  <span className="text-blue-100">Dental Screening</span>
                </h2>

                <p className="text-blue-50 mb-8 text-lg leading-relaxed">
                  Provide your gym members with convenient AI-powered dental
                  screenings to promote complete health and wellness.
                </p>

                <div className="space-y-3">
                  {[
                    "Quick 2-minute screenings",
                    "Mobile-friendly for your members",
                    "Secure health data protection",
                    "Instant AI-powered results",
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
                  <Shield className="w-4 h-4" />
                  <span>HIPAA compliant • Perfect for fitness centers</span>
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
                    Register Gym
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
                  {isLogin ? "Access Your Gym Dashboard" : "Register Your Gym"}
                </h3>
                <p className="text-gray-500">
                  {isLogin
                    ? "Sign in to manage your gym's screening QR codes"
                    : "Get started with dental screenings for your members"}
                </p>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EBFF7] focus:border-transparent transition-colors"
                      placeholder="admin@yourgym.com"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EBFF7] focus:border-transparent transition-colors"
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Signing In...
                      </div>
                    ) : (
                      "Access Gym Dashboard"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* YOUR EXISTING REGISTER FORM (unchanged) */}
                  {/* (kept exactly as your earlier version, uses formData) */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gym Name *
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
                        placeholder="Sunshine Fitness Center"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="admin@sunshinefitnesscenter.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
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
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gym Address *
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
                        placeholder="123 Main Street"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
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
                        required
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
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
                        required
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                      >
                        <option value="">Select State</option>
                        {usStates.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
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
                      required
                      maxLength={5}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter a secure password"
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#4EBFF7] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 characters
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.termsAccepted}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            termsAccepted: e.target.checked,
                          })
                        }
                        className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-[#4EBFF7] focus:ring-2 focus:ring-[#4EBFF7] focus:ring-offset-0 cursor-pointer"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        I understand this is a{" "}
                        <span className="font-semibold">
                          non-medical service
                        </span>
                        . Reports generated are for informational and preventive
                        purposes only. No medical advice will be provided.
                      </label>
                    </div>

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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Registering...
                        </div>
                      ) : (
                        "Register Gym"
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
