// src/app/(public)/Dentalscandemo/HowItWorksSection.tsx
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            From Patient Submission to Claim in Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DentalScan streamlines every step of teledentistry with intelligent
            automation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 h-full border border-[#4ebff7]/20 hover:shadow-xl transition-all">
              <div className="mb-6 relative h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-32 bg-gray-800 rounded-lg border-4 border-gray-700 shadow-xl relative overflow-hidden">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-700 rounded-full" />
                    <div className="absolute inset-2 bg-white rounded flex flex-col p-1">
                      <div className="space-y-1 mt-2">
                        <div className="bg-[#4ebff7] text-white text-[6px] p-1 rounded max-w-[80%] animate-slideIn">
                          DentalScan Link 📱
                        </div>
                        <div
                          className="bg-[#4ebff7] text-white text-[5px] p-1 rounded max-w-[90%] animate-slideIn"
                          style={{ animationDelay: "0.5s" }}
                        >
                          Click to start check-up
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <div className="w-2 h-2 bg-[#4ebff7] rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-[#4ebff7] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-[#4ebff7] rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>

              <div className="inline-block px-3 py-1 bg-[#4ebff7] text-white rounded-full text-sm font-bold mb-4">
                Step 1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Patient Receives Link
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Send a secure SMS link to patients for remote photo capture of
                their teeth and gums. Patients get instant access via text
                message.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-[#4ebff7] animate-pulse" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 h-full border border-[#4ebff7]/20 hover:shadow-xl transition-all">
              <div className="mb-6 relative h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="relative">
                    <div className="w-16 h-20 bg-white rounded-t-3xl rounded-b-lg border-2 border-gray-300 shadow-lg relative">
                      <div className="absolute inset-x-2 top-2 h-12 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl" />
                      <div className="absolute top-6 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-1 bg-[#4ebff7] opacity-50 animate-scan" />
                    </div>

                    <div className="absolute -right-8 top-4 bg-red-500 text-white text-[6px] px-1 py-0.5 rounded animate-pulse">
                      Issue Detected
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-28 h-28 border-2 border-[#4ebff7]/30 rounded-full animate-ping" />
                  </div>
                </div>
              </div>

              <div className="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold mb-4">
                Step 2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                AI Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AI identifies problem areas, organizes images, and prepares
                clinical summaries. Automated detection highlights concerns
                instantly.
              </p>

              <div className="mt-4 flex gap-2 justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div
                  className="w-3 h-3 bg-[#4ebff7] rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-[#4ebff7] animate-pulse" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 h-full border border-[#4ebff7]/20 hover:shadow-xl transition-all">
              <div className="mb-6 relative h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="relative">
                    <div className="w-20 h-24 bg-white rounded-lg shadow-lg border border-gray-200 p-2 relative">
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded w-full" />
                        <div className="h-1 bg-gray-300 rounded w-4/5" />
                        <div className="h-1 bg-gray-300 rounded w-full" />
                        <div className="h-1 bg-[#4ebff7] rounded w-3/4 animate-pulse" />
                        <div className="h-1 bg-gray-200 rounded w-full" />
                        <div className="h-1 bg-gray-200 rounded w-2/3" />
                      </div>

                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="absolute top-1 -right-1 w-20 h-24 bg-gray-100 rounded-lg -z-10" />
                    <div className="absolute top-2 -right-2 w-20 h-24 bg-gray-50 rounded-lg -z-20" />
                  </div>

                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                    <div
                      className="absolute bottom-2 left-0 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    />
                    <div
                      className="absolute top-1/2 -right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    />
                  </div>
                </div>
              </div>

              <div className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold mb-4">
                Step 3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Submit Claim
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Review findings and submit pre-filled insurance claims with all
                required codes. One-click submission saves hours of paperwork.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
