// src/app/(public)/Dentalscandemo/SecuritySection.tsx
import { Shield, Lock, Database, FileText, CheckCircle2 } from "lucide-react";

const SECURITY_ITEMS = [
  {
    icon: <Shield />,
    label: "256-bit Encryption",
    bgClass: "bg-[#4ebff7]/10",
    iconClass: "text-[#4ebff7]",
  },
  {
    icon: <Lock />,
    label: "Access Control",
    bgClass: "bg-indigo-600/10",
    iconClass: "text-indigo-600",
  },
  {
    icon: <Database />,
    label: "Secure Storage",
    bgClass: "bg-purple-600/10",
    iconClass: "text-purple-600",
  },
  {
    icon: <FileText />,
    label: "Audit Logs",
    bgClass: "bg-green-600/10",
    iconClass: "text-green-600",
  },
];

export default function SecuritySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Fully HIPAA-Compliant and Secure by Design
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every photo, report, and claim processed through DentalScan is
              protected under HIPAA privacy standards. All communication is
              encrypted in transit and at rest.
            </p>
            <div className="space-y-4">
              {[
                "End-to-end encryption for all patient data",
                "HIPAA-compliant secure cloud environment",
                "Encrypted report generation and storage",
                "Role-based access control for your team",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-6 h-6 text-[#4ebff7] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 font-medium text-lg">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-[#4ebff7]/20 shadow-xl">
            <div className="space-y-4">
              {SECURITY_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group"
                >
                  <span className="font-semibold text-gray-700">
                    {item.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-lg ${item.bgClass} flex items-center justify-center ${item.iconClass} group-hover:scale-110 transition-transform`}
                  >
                    {item.icon}
                  </div>
                </div>
              ))}

              <div className="mt-6 p-6 bg-gradient-to-r from-[#4ebff7]/10 to-cyan-50 rounded-xl border-2 border-[#4ebff7]/30">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-8 h-8 text-[#4ebff7]" />
                  <span className="font-bold text-gray-900 text-lg">
                    HIPAA Certified
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Full compliance with healthcare data protection regulations.
                  Your patient data is always secure and private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
