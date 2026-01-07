"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Dumbbell,
  GraduationCap,
  Heart,
} from "lucide-react";

export default function DentalScanOrganizationSelector() {
  // Debug: Log when component renders
  useEffect(() => {
    console.log(
      "🔄 DentalScanOrganizationSelector component mounted/rendered at:",
      new Date().toISOString()
    );

    // Cleanup function to log when component unmounts
    return () => {
      console.log(
        "🔄 DentalScanOrganizationSelector component unmounting at:",
        new Date().toISOString()
      );
    };
  }, []);

  const organizationTypes = [
    {
      id: "dental-office",
      title: "Dental Office",
      subtitle: "Professional Practice",
      icon: <Building2 className="w-10 h-10 text-white" />,
      emoji: "🦷",
      description:
        "Licensed dental practices providing professional dental care and clinical services with full diagnostic capabilities.",
      gradient: "from-[#4EBFF7] to-cyan-400",
      hoverGradient: "hover:from-[#3DAEE6] hover:to-cyan-500",
      iconBg: "bg-gradient-to-br from-[#4EBFF7] to-cyan-400",
      link: "/signup",
    },
    {
      id: "gym",
      title: "Gym / Wellness Center",
      subtitle: "Fitness & Health",
      icon: <Dumbbell className="w-10 h-10 text-white" />,
      emoji: "💪",
      description:
        "Fitness centers and wellness facilities offering preventive dental screenings as part of member health benefits.",
      gradient: "from-cyan-400 to-[#4EBFF7]",
      hoverGradient: "hover:from-cyan-500 hover:to-[#3DAEE6]",
      iconBg: "bg-gradient-to-br from-cyan-400 to-[#4EBFF7]",
      link: "/multiusecase/gym",
    },
    {
      id: "school",
      title: "School",
      subtitle: "Coming Soon",
      icon: <GraduationCap className="w-10 h-10 text-white" />,
      emoji: "🎓",
      description:
        "Schools and educational institutions providing dental health screenings for students as part of wellness programs. Available soon!",
      gradient: "from-gray-300 to-gray-400",
      hoverGradient: "hover:from-gray-400 hover:to-gray-500",
      iconBg: "bg-gradient-to-br from-gray-300 to-gray-400",
      link: "#",
    },
    {
      id: "charity",
      title: "Charity / Community",
      subtitle: "Non-Profit Organization",
      icon: <Heart className="w-10 h-10 text-white" />,
      emoji: "❤️",
      description:
        "Non-profit organizations and community health programs providing accessible dental care to underserved populations.",
      gradient: "from-cyan-500 to-[#4EBFF7]",
      hoverGradient: "hover:from-cyan-600 hover:to-[#3DAEE6]",
      iconBg: "bg-gradient-to-br from-cyan-500 to-[#4EBFF7]",
      link: "/multiusecase/charity",
    },
  ];

  const handleNavigate = (link: string, orgId: string) => {
    if (orgId === "school") {
      alert("School programs are coming soon! Please check back later.");
      return;
    }
    console.log("Navigating to:", link);
    // Actual navigation
    window.location.href = link;
  };

  const handleBack = () => {
    console.log("Going back to product selection");
    // Navigate back to entrance page
    window.location.href = "/entrance";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4EBFF7] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-400 opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-40 right-1/4 w-96 h-96 bg-[#4EBFF7] opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-3 shadow-lg">
                <Image
                  src="/ReplyQuick.jpeg"
                  alt="ReplyQuick Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">DentalScan</h1>
                <p className="text-sm text-gray-500">by ReplyQuick.ai</p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#4EBFF7] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Products</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="max-w-6xl w-full">
            {/* Welcome Text */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-linear-to-r from-[#4EBFF7] to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  DentalScan Platform
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Select Your
                <span className="block bg-linear-to-r from-[#4EBFF7] to-cyan-500 text-transparent bg-clip-text">
                  Organization Type
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the option that best describes your organization
              </p>
            </div>

            {/* Organization Type Cards - 4 Cards in 2x2 Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {organizationTypes.map((org) => (
                <div
                  key={org.id}
                  className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-[#4EBFF7] cursor-pointer ${
                    org.id === "school" ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleNavigate(org.link, org.id)}
                >
                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-xl ${org.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-3xl">{org.emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#4EBFF7] transition-colors">
                        {org.title}
                      </h3>
                      <p className="text-sm text-gray-500">{org.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed min-h-20">
                    {org.description}
                  </p>

                  {/* Button */}
                  <button
                    className={`w-full py-3.5 rounded-xl bg-linear-to-r ${
                      org.gradient
                    } ${
                      org.hoverGradient
                    } text-white font-semibold flex items-center justify-center gap-2 group-hover:shadow-xl transition-all duration-300 ${
                      org.id === "school" ? "cursor-not-allowed opacity-75" : ""
                    }`}
                    disabled={org.id === "school"}
                  >
                    <span>
                      {org.id === "school"
                        ? "Coming Soon"
                        : `Continue as ${org.title}`}
                    </span>
                    {org.id !== "school" && (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-12 max-w-3xl mx-auto bg-blue-50 border-2 border-[#4EBFF7] rounded-xl p-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#4EBFF7] flex items-center justify-center">
                    <span className="text-white text-xl">💡</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Not sure which to choose?
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <strong>Dental Office</strong> is for licensed dental
                    practices with professional dentists.
                    <strong> All other options</strong> are for community health
                    programs, wellness centers, schools, and non-profit
                    organizations offering preventive dental screenings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 px-8 border-t border-gray-200 bg-white bg-opacity-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2024 ReplyQuick.ai. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-[#4EBFF7] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#4EBFF7] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#4EBFF7] transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
