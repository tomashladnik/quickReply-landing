// src/app/patient-scan/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import PatientImageCapture from "@/app/components/patientImageCapture";

interface PatientData {
  scanId: string;
  patient_name: string;
  phone: string;
  email: string;
  status: string;
  result?: any;
}

function PatientScanPageClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!submitted || result !== null) return;
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/demo/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) return;

        if (data?.status === "completed") setSubmitted(true);
        if (data?.result) {
          setResult(data.result);
          clearInterval(interval);
        }
      } catch {
        // ignore retry errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [submitted, result, token]);

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Invalid scan link. Token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/demo/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch patient data");
      }

      setPatientData(data);

      if (data.status === "completed") {
        setSubmitted(true);
        setResult(data.result ?? null);
      } else {
        setSubmitted(false);
        setResult(null);
      }
    } catch (err: any) {
      console.error("Error fetching patient data:", err);
      setError(err.message || "Failed to load patient information");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleNext = () => {
    if (!dateOfBirth) {
      setError("Please enter your date of birth");
      return;
    }
    const age = calculateAge(dateOfBirth);
    if (age < 14) {
      setError("You must be at least 14 years old to use this service");
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleComplete = (res?: any) => {
    setSubmitted(true);
    if (res?.result) setResult(res.result);
    else setResult(null);
  };

  // ---------- Result formatting helpers ----------
  const formatPercent = (x: any) => {
    const n = typeof x === "number" ? x : Number(x);
    if (Number.isNaN(n)) return null;
    const pct = n <= 1 ? n * 100 : n;
    return Math.max(0, Math.min(100, pct));
  };

  const humanizeType = (t: string) => {
    const key = (t || "").toLowerCase();
    const map: Record<string, { title: string; desc: string; next: string }> = {
      caries: {
        title: "Possible Cavities",
        desc: "Some tooth areas may look like decay. This is common and treatable.",
        next: "Schedule a dental exam to confirm and discuss treatment options.",
      },
      gingivitis: {
        title: "Possible Gum Inflammation",
        desc: "Gums may look irritated. Brushing/flossing gently can help.",
        next: "If bleeding or swelling continues, consult a dentist.",
      },
      "mouth ulcer": {
        title: "Possible Mouth Ulcer",
        desc: "A sore/ulcer may be visible. Many heal on their own—monitor it.",
        next: "If it doesn’t improve within 1–2 weeks, consult a dentist or doctor.",
      },
      "tooth discoloration": {
        title: "Tooth Discoloration",
        desc: "There may be staining or color changes. A dentist can advise options.",
        next: "Discuss whitening/cleaning options at your next dental visit.",
      },
      hypodontia: {
        title: "Possible Missing Tooth",
        desc: "A tooth may be missing or not visible in the photos.",
        next: "A dentist can confirm and discuss restorative options if needed.",
      },
    };

    return (
      map[key] || {
        title: t || "Finding",
        desc: "This is a demo summary based on your photos.",
        next: "Schedule a dental exam if you have concerns.",
      }
    );
  };

  const normalizeFindings = (raw: any) => {
    if (!raw) return [];
    const list =
      (Array.isArray(raw) && raw) ||
      raw.findings ||
      raw.predictions ||
      raw.conditions ||
      raw.results ||
      [];
    if (!Array.isArray(list)) return [];

    return list
      .map((x: any) => ({
        type: x?.type ?? x?.label ?? x?.name ?? "Finding",
        confidence: formatPercent(x?.confidence ?? x?.score ?? x?.probability),
      }))
      .filter((x: any) => x.type)
      .sort((a: any, b: any) => (b.confidence ?? 0) - (a.confidence ?? 0));
  };

  const normalizeRecommendations = (raw: any) => {
    const recs = raw?.recommendations;
    if (!recs) return [];
    if (Array.isArray(recs)) return recs.filter(Boolean);
    if (typeof recs === "string") return [recs];
    return [];
  };

  const findings = normalizeFindings(result);
  const topFindings = findings.slice(0, 2);
  const extraFindings = findings.slice(2);
  const recommendations = normalizeRecommendations(result);
  const modelVersion = result?.model_version || result?.modelVersion || null;

  // ---------- Result screen ----------
  if (submitted) {
    const isReady = result !== null;

    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-sky-100">
          <div className="px-6 py-5 bg-[#4ebff7] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center">
                {isReady ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {isReady ? "Your demo results" : "Fetching results…"}
                </h2>
                <p className="text-xs text-white/90">
                  {isReady
                    ? `Here’s a simple summary based on your photos.${modelVersion ? ` (Model: ${modelVersion})` : ""}`
                    : "Your photos were submitted successfully. This page will update automatically."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {!isReady ? (
              <div className="border border-sky-100 rounded-xl p-4 bg-sky-50">
                <p className="text-sm font-semibold text-gray-900">Please wait</p>
                <p className="text-xs text-gray-700 mt-1">
                  We’re analyzing your images and generating your demo summary.
                </p>
                <div className="mt-3 h-2 w-full bg-sky-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4ebff7] animate-pulse w-2/3" />
                </div>
                <p className="text-[11px] text-gray-500 mt-3">
                  If you opened the SMS link again, you may land here while results finish processing.
                </p>
              </div>
            ) : (
              <>
                {topFindings.length > 0 ? (
                  <div className="space-y-3">
                    {topFindings.map((f: any, idx: number) => {
                      const ui = humanizeType(f.type);
                      const pct = f.confidence ?? null;

                      return (
                        <div key={`${f.type}-${idx}`} className="border border-sky-100 rounded-xl p-4 bg-sky-50/30">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{ui.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{ui.desc}</p>
                            </div>
                            {pct !== null && (
                              <div className="text-right shrink-0">
                                <p className="text-xs font-semibold text-gray-900">{Math.round(pct)}%</p>
                                <p className="text-[10px] text-gray-500">confidence</p>
                              </div>
                            )}
                          </div>

                          {pct !== null && (
                            <div className="mt-3">
                              <div className="h-2 w-full bg-sky-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#4ebff7]" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )}

                          <div className="mt-3 text-xs text-gray-700">
                            <span className="font-semibold">Next step:</span> {ui.next}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Analysis complete</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Your demo result is saved, but we couldn’t generate a structured summary.
                    </p>
                  </div>
                )}

                {extraFindings.length > 0 && (
                  <div className="border border-gray-200 rounded-xl p-4 bg-white">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Other possible findings</p>
                    <div className="space-y-2">
                      {extraFindings.slice(0, 4).map((f: any, idx: number) => {
                        const ui = humanizeType(f.type);
                        const pct = f.confidence ?? null;
                        return (
                          <div key={`${f.type}-extra-${idx}`} className="flex items-center justify-between gap-3">
                            <p className="text-xs text-gray-700">{ui.title}</p>
                            {pct !== null && <p className="text-xs text-gray-500">{Math.round(pct)}%</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border border-sky-100 rounded-xl p-4 bg-sky-50">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Recommended next steps</p>
                  {recommendations.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {recommendations.slice(0, 5).map((r: string, i: number) => (
                        <li key={i} className="text-xs text-gray-700">
                          {r}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-700">
                      Consider scheduling a dental exam if you have pain, swelling, bleeding gums, or concerns.
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="font-semibold text-gray-600">Important:</span> This is a demo and not a medical
                  diagnosis. Always consult a licensed dentist for confirmation.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#4ebff7] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Loading patient information...</p>
        </div>
      </div>
    );
  }

  // ---------- Error (no patient data) ----------
  if (error && !patientData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Failed to load patient information"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---------- Normal 2-step flow ----------
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Image src="/logo.png" alt="ReplyQuick" width={28} height={28} className="shrink-0" />
              <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">DentalScan – Live Demo</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
                Not for medical use
              </span>
            </div>
            <div className="text-xs font-medium text-gray-600 self-end sm:self-auto">Step {currentStep}/2</div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="mb-2 sm:mb-3">
            <div className="w-full h-1.5 rounded-full bg-gray-100">
              <div
                style={{ width: `${currentStep === 1 ? 50 : 100}%` }}
                className="h-full bg-[#4ebff7] rounded-full transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setCurrentStep(1)}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                currentStep === 1
                  ? "bg-[#4ebff7] text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-[#4ebff7] text-[10px] font-bold shrink-0">
                1
              </span>
              <span className="hidden xs:inline">Personal Info</span>
              <span className="xs:hidden">Info</span>
            </button>

            <button
              disabled
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                currentStep === 2
                  ? "bg-[#4ebff7] text-white"
                  : "bg-white border border-gray-300 text-gray-700 opacity-60 cursor-not-allowed"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold shrink-0 ${
                  currentStep === 2 ? "bg-white text-[#4ebff7]" : "bg-gray-100 text-gray-600"
                }`}
              >
                2
              </span>
              <span>Images</span>
            </button>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <main className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Personal info</h2>
              <p className="text-xs text-gray-500">
                Verify your details, enter your date of birth, then continue to take your sample photos.
              </p>
            </div>

            {error && patientData && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-red-600 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
                <input
                  type="text"
                  value={patientData?.patient_name ?? ""}
                  readOnly
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={patientData?.phone ?? ""}
                  readOnly
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="text"
                  value={patientData?.email ?? ""}
                  readOnly
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    if (error) setError(null);
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent transition-all"
                />
                <p className="mt-1 text-[10px] text-gray-500">You must be at least 14 years old</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">Step 1 of 2</p>
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <button
                onClick={() => window.history.back()}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-semibold rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      )}

      {currentStep === 2 && patientData && (
        <PatientImageCapture
          token={token || "test-token"}
          patientName={patientData.patient_name}
          dateOfBirth={dateOfBirth}
          onComplete={handleComplete}
          onBack={() => setCurrentStep(1)}
        />
      )}
    </div>
  );
}

export default function PatientScanPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <PatientScanPageClient />
    </Suspense>
  );
}