// src/app/(public)/Dentalscandemo/HeroSection.tsx
import Image from "next/image";
import { CheckCircle2, Activity, Shield } from "lucide-react";

type HeroSectionProps = {
  onOpenDemo: () => void;
};

export default function HeroSection({ onOpenDemo }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#4ebff7]/10 text-[#4ebff7] border border-[#4ebff7]/20">
                Powered by ReplyQuick
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Teledentistry Made{" "}
              <span className="block text-[#4ebff7]">Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              DentalScan helps dental offices perform remote preventive
              check-ups, detect oral health concerns, and automatically prepare
              insurance claims — all through one secure, HIPAA-compliant link.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onOpenDemo}
                className="px-8 py-4 bg-[#4ebff7] text-white rounded-lg font-semibold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Live Demo
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white text-[#4ebff7] rounded-lg font-semibold text-lg border-2 border-[#4ebff7] hover:bg-blue-50 transition-all"
              >
                Learn More
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Available at{" "}
              <span className="font-mono text-[#4ebff7] font-semibold">
                replyquick.ai/dentalscan
              </span>
            </p>
          </div>

          {/* Right Content - Mock Dashboard */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              {/* AI-Powered Badge */}
              <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4ebff7] rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">
                  AI-Powered
                </span>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Patient Scans
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    5 Active
                  </span>
                </div>

                {/* Patient Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-[#4ebff7]/30 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ebff7] to-[#3da5d9] flex items-center justify-center text-white font-bold text-lg shadow-md">
                        JD
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">John Doe</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Submitted 2 hours ago
                        </div>
                      </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[
                        { label: "Left", view: "left" },
                        { label: "Right", view: "right" },
                        { label: "Center", view: "center" },
                        { label: "Upper", view: "upper" },
                        { label: "Lower", view: "lower" },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <div className="relative w-full h-24 bg-white rounded-lg border-2 border-[#4ebff7]/40 mb-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="absolute inset-0 bg-gradient-to-b from-pink-100/30 via-white to-pink-50/20" />
                            <Image
                              src={`/dental/${item.view}.png`}
                              alt={`${item.label} Tooth Scan`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 80px, 120px"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-pink-200/40 to-transparent" />
                            <div className="absolute top-1 right-1 w-5 h-5 bg-[#4ebff7] rounded-full flex items-center justify-center z-10">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-600">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#4ebff7]/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-700">
                          AI Analysis Complete
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-[#4ebff7] text-white rounded-lg text-sm font-semibold hover:bg-[#3da5d9] transition-colors shadow-md">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-sm font-bold text-gray-700">
                  HIPAA Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
