// src/app/(public)/Dentalscandemo/FeaturesSection.tsx
import {
  Phone,
  Search,
  FileText,
  Shield,
  Users,
  FileCheck,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Remote Dental Care
          </h2>
          <p className="text-xl text-gray-600">
            Complete teledentistry platform built for modern dental practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Phone className="w-6 h-6" />,
              title: "Remote Photo Check-ins",
              description:
                "Patients capture and submit dental photos from their phones via secure SMS link",
              gradient: "from-[#4ebff7] to-[#3da5d9]",
            },
            {
              icon: <Search className="w-6 h-6" />,
              title: "AI Condition Detection",
              description:
                "Intelligent system identifies potential issues in teeth and gums automatically",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: <FileText className="w-6 h-6" />,
              title: "Automatic Summaries",
              description:
                "Generate clinical summaries for patient records and office documentation instantly",
              gradient: "from-indigo-500 to-indigo-600",
            },
            {
              icon: <FileCheck className="w-6 h-6" />,
              title: "Pre-filled Claims",
              description:
                "Insurance claims automatically populated with D9996, D0140, D0191 codes",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "HIPAA Compliant",
              description:
                "End-to-end encryption and secure storage meeting all compliance standards",
              gradient: "from-blue-600 to-cyan-600",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Team Collaboration",
              description:
                "Role-based access and audit logs for your entire dental team",
              gradient: "from-orange-500 to-red-500",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all border border-gray-100 hover:border-[#4ebff7]/30 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
