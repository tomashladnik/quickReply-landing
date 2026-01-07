// src/app/multiusecase/charity/result/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type CarePriority = "Low" | "Medium" | "High";
type PartnerSource = "A" | "B" | "C";

interface PartnerCard {
  partnerName: string;
  contactInfo: string;
  address: string;
  source?: PartnerSource;
}

interface CharityResult {
  carePriorityScore: CarePriority;
  explanation: string;
  routingInfo: {
    partners: PartnerCard[];
    nextSteps: string[];
  };
  detectedIssues?: string[];
}

export default function CharityResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CharityResultContent />
    </Suspense>
  );
}

function CharityResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "demo-token";
  const userId = searchParams.get("userId") || token;

  const [result, setResult] = useState<CharityResult | null>(null);
  const [mlData, setMlData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activePartnerIndex, setActivePartnerIndex] = useState(0);

  const handlePrint = () => {
    const code = userId;
    const type = "charity";
    const title = encodeURIComponent("Dental Screening Results");
    const subtitle = encodeURIComponent("AI-Powered Oral Health Analysis");
    const printUrl = `/multiusecase/print?code=${code}&type=${type}&title=${title}&subtitle=${subtitle}`;
    window.open(printUrl, "_blank");
  };

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActivePartnerIndex(0);
  }, [result?.routingInfo?.partners?.length]);

  function safeString(v: any): string | null {
    if (typeof v !== "string") return null;
    const s = v.trim();
    return s ? s : null;
  }

  function extractDigits(v: string) {
    return (v || "").replace(/\D/g, "");
  }

  function normalizePartnerSource(v: any): PartnerSource {
    const s = String(v || "")
      .trim()
      .toLowerCase();

    if (s === "a" || s.includes("manual") || s.includes("charity")) return "A";
    if (s === "b" || s.includes("network") || s.includes("replyquick"))
      return "B";
    if (s === "c") return "C";

    return "C";
  }

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Getting user data and ML results for userId:", userId);
      const userResponse = await fetch(
        `/api/multiuse/user-info?userId=${encodeURIComponent(userId)}`,
        { cache: "no-store" }
      );

      if (!userResponse.ok) {
        throw new Error("Unable to fetch user information.");
      }

      const userData = await userResponse.json();
      console.log("User data retrieved:", userData);

      let mlDataLocal: any = null;

      console.log("Inspecting userData structure:");
      console.log("- resultJson:", userData.resultJson);
      console.log("- originalJson:", userData.originalJson);
      console.log("- status:", userData.status);

      if (userData.resultJson && (userData.resultJson as any).mlAnalysis) {
        console.log("✅ Using stored ML analysis from resultJson");
        mlDataLocal = (userData.resultJson as any).mlAnalysis;
      } else if (
        userData.resultJson &&
        typeof userData.resultJson === "object"
      ) {
        console.log("🔍 Checking if resultJson itself contains ML data...");
        const resultData = userData.resultJson as any;
        if (
          resultData.triage_status ||
          resultData.carePriorityScore ||
          resultData.whitening_analysis ||
          resultData.overall_status ||
          resultData.findings ||
          resultData.recommendations
        ) {
          console.log("✅ Found ML data directly in resultJson");
          mlDataLocal = resultData;
        }
      } else if (
        userData.originalJson &&
        (userData.originalJson as any).mlResults
      ) {
        console.log("✅ Using ML results from originalJson");
        mlDataLocal = (userData.originalJson as any).mlResults;
      } else if (
        userData.originalJson &&
        typeof userData.originalJson === "object"
      ) {
        console.log("🔍 Checking if originalJson contains ML data...");
        const originalData = userData.originalJson as any;
        if (
          originalData.triage_status ||
          originalData.carePriorityScore ||
          originalData.whitening_analysis ||
          originalData.overall_status ||
          originalData.findings ||
          originalData.recommendations
        ) {
          console.log("✅ Found ML data directly in originalJson");
          mlDataLocal = originalData;
        }
      }

      console.log("🔍 Final ML data check - found:", !!mlDataLocal);

      if (!mlDataLocal) {
        console.log(
          "⚠️ No stored ML data found - generating fallback assessment"
        );
        mlDataLocal = {
          triage_status: "Medium",
          carePriorityScore: "Medium",
          explanation:
            "Assessment completed using general wellness guidelines. For detailed AI analysis, please try uploading new images.",
          conditions: ["General oral health maintenance recommended"],
          quality_score: 0.8,
        };
        setError(
          "Advanced ML analysis not available - showing general assessment"
        );
      }

      console.log("ML Analysis Data:", mlDataLocal);

      const rawPriorityScore =
        mlDataLocal.triage_status ||
        mlDataLocal.carePriorityScore ||
        mlDataLocal.overall_status ||
        "Medium";

      const mapToCarePriority = (value: string): CarePriority => {
        const normalized = (value || "").toLowerCase();
        if (
          normalized === "high" ||
          normalized === "urgent" ||
          normalized === "critical"
        )
          return "High";
        if (
          normalized === "medium" ||
          normalized === "moderate" ||
          normalized === "routine"
        )
          return "Medium";
        if (
          normalized === "low" ||
          normalized === "ok" ||
          normalized === "good" ||
          normalized === "normal"
        )
          return "Low";
        return "Medium";
      };

      const carePriorityScore = mapToCarePriority(rawPriorityScore);

      const conditions =
        mlDataLocal.conditions ||
        mlDataLocal.detectedIssues ||
        (mlDataLocal.findings
          ? mlDataLocal.findings
              .filter((f: any) => f.confidence > 0.5)
              .map((f: any) => f.type)
          : []) ||
        mlDataLocal.recommendations ||
        [];

      const qualityScore =
        mlDataLocal.quality_score ||
        (mlDataLocal.quality ? mlDataLocal.quality.score : null) ||
        0.8;

      const explanation =
        mlDataLocal.explanation ||
        (mlDataLocal.recommendations && mlDataLocal.recommendations.length > 0
          ? mlDataLocal.recommendations.join(" ")
          : null) ||
        `Medical screening complete. Quality score: ${(
          qualityScore * 100
        ).toFixed(
          0
        )}%. Professional evaluation recommended for detailed assessment.`;

      const businessId =
        safeString(userData?.user?.businessId) ||
        safeString(userData?.businessId) ||
        safeString(userData?.orgId) ||
        safeString(userData?.organizationId) ||
        safeString(userData?.business_id) ||
        safeString(userData?.organization_id) ||
        null;

      let resolvedPartners: PartnerCard[] = [
        {
          partnerName: "No Partner Clinic Assigned Yet",
          contactInfo: "Use your program’s main contact number.",
          address:
            "Please contact your program coordinator for local dental referral options.",
          source: "C",
        },
      ];

      // Pull both charity partners (A) and network partners (B)
      if (businessId) {
        try {
          const partnerRes = await fetch(
            `/api/multiusecase/charity/partner?businessId=${encodeURIComponent(
              businessId
            )}`,
            { cache: "no-store" }
          );

          if (partnerRes.ok) {
            const partnerJson = await partnerRes.json();
            const rawList: any[] = Array.isArray(partnerJson?.partners)
              ? partnerJson.partners
              : [];

            const mapped: PartnerCard[] = rawList
              .map((partner) => {
                const clinicName =
                  safeString(partner?.clinic_name) ||
                  safeString(partner?.clinicName) ||
                  null;

                const addressLine =
                  safeString(partner?.address_line) ||
                  safeString(partner?.addressLine) ||
                  null;

                const phoneNumber =
                  safeString(partner?.phone_number) ||
                  safeString(partner?.phoneNumber) ||
                  null;

                const rawSource = partner?.source;

                if (!clinicName && !addressLine && !phoneNumber) {
                  return null;
                }

                return {
                  partnerName: clinicName || "No Partner Clinic Assigned Yet",
                  address:
                    addressLine ||
                    "Please contact your program coordinator for local dental referral options.",
                  contactInfo:
                    phoneNumber || "Use your program’s main contact number.",
                  source: normalizePartnerSource(rawSource),
                };
              })
              .filter(Boolean) as PartnerCard[];

            if (mapped.length > 0) {
              resolvedPartners = mapped;
            }
          } else {
            console.warn(
              "⚠️ Charity partner endpoint returned non-200:",
              partnerRes.status
            );
          }
        } catch (e) {
          console.warn(
            "⚠️ Charity partner fetch failed (using fallback routing):",
            e
          );
        }
      } else {
        console.warn(
          "⚠️ No businessId found in userData; using fallback routing."
        );
      }

      const apiResult: CharityResult = {
        carePriorityScore: carePriorityScore as CarePriority,
        explanation,
        routingInfo: {
          partners: resolvedPartners,
          nextSteps: [
            "Call to schedule your free consultation",
            "Bring this screening result to your appointment",
            "Ask about financial assistance programs if needed",
            "Follow the recommended treatment plan",
          ],
        },
        detectedIssues: conditions.map((condition: any) =>
          typeof condition === "string"
            ? condition
            : condition.type ||
              condition.name ||
              "General dental health assessment"
        ),
      };

      try {
        const processedResult = {
          carePriorityScore: apiResult.carePriorityScore,
          explanation: apiResult.explanation,
          mlTimestamp:
            mlDataLocal.analysis_timestamp || new Date().toISOString(),
          mlConfidence:
            mlDataLocal.overall_confidence || mlDataLocal.confidence || 0.9,
          detectedIssues: (apiResult.detectedIssues || []).map(
            (issue: string) => ({
              type: issue,
              confidence: 0.8,
              description: issue,
            })
          ),
          qualityScore,
          routingInfo: apiResult.routingInfo,
          mlAnalysisVersion: mlDataLocal.model_version || "v1.0",
          flowType: "charity",
          priorityLevel: apiResult.carePriorityScore,
        };

        const updateResponse = await fetch(`/api/multiuse/user-info`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            processedResult,
          }),
        });

        if (updateResponse.ok) {
          console.log(
            "✅ Charity results saved to database for dashboard access"
          );
        } else {
          console.warn("⚠️ Failed to save charity results to database");
        }
      } catch (saveError) {
        console.warn("⚠️ Error saving charity results:", saveError);
      }

      setResult(apiResult);
      setMlData(mlDataLocal);
    } catch (err) {
      console.error("Error loading results:", err);

      const fallbackResult: CharityResult = {
        carePriorityScore: "Medium",
        explanation:
          "Basic medical screening completed. Our advanced analysis system is temporarily unavailable. This general assessment recommends professional dental evaluation for comprehensive care planning.",
        routingInfo: {
          partners: [
            {
              partnerName: "No Partner Clinic Assigned Yet",
              contactInfo: "Use your program’s main contact number.",
              address:
                "Please contact your program coordinator for local dental referral options.",
              source: "C",
            },
          ],
          nextSteps: [
            "Call to schedule your free consultation",
            "Bring this screening result to your appointment",
            "Ask about financial assistance programs if needed",
            "Follow the recommended treatment plan",
          ],
        },
        detectedIssues: [
          "General oral health maintenance recommended",
          "Regular dental checkup advised",
          "Preventive care consultation suggested",
        ],
      };

      setResult(fallbackResult);
      setError(
        "Advanced analysis temporarily unavailable - showing basic screening"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (priority: CarePriority) => {
    switch (priority) {
      case "High":
        return {
          icon: AlertCircle,
          color: "#ef4444",
          bgColor: "#fee2e2",
          textColor: "#991b1b",
          title: "Attention Needed",
          message:
            "We strongly recommend scheduling a dental evaluation as soon as possible.",
        };
      case "Medium":
        return {
          icon: Clock,
          color: "#f59e0b",
          bgColor: "#fef3c7",
          textColor: "#92400e",
          title: "Evaluation Recommended",
          message: "You may benefit from a professional dental evaluation.",
        };
      case "Low":
        return {
          icon: CheckCircle,
          color: "#10b981",
          bgColor: "#d1fae5",
          textColor: "#065f46",
          title: "Looking Good",
          message:
            "Continue your regular dental care routine and preventive visits.",
        };
      default:
        return {
          icon: Clock,
          color: "#6b7280",
          bgColor: "#f3f4f6",
          textColor: "#374151",
          title: "Analysis Complete",
          message:
            "Please consult with a dental professional for personalized care recommendations.",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4EBFF7] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Analyzing your dental screening...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will only take a moment
          </p>
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Service Unavailable
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Results
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't retrieve your screening results. Please try again.
          </p>
          <button
            onClick={() =>
              router.push(
                `/multiusecase/charity/capture?token=${token}&userId=${userId}`
              )
            }
            className="w-full px-6 py-3 bg-[#4EBFF7] hover:bg-[#3da8d9] text-white rounded-xl font-semibold transition"
          >
            Retake Screening
          </button>
        </div>
      </div>
    );
  }

  const config = getPriorityConfig(result.carePriorityScore);
  const Icon = config.icon;

  const partners = result.routingInfo.partners || [];
  const activePartner =
    partners.length > 0
      ? partners[
          Math.min(
            activePartnerIndex,
            partners.length - 1 < 0 ? 0 : partners.length - 1
          )
        ]
      : null;

  const phoneDigits = extractDigits(activePartner?.contactInfo || "");
  const canTel = phoneDigits.length >= 7;
  const hasMultiplePartners = partners.length > 1;

  const partnerSource = activePartner?.source || "C";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 print-layout">
      <div className="bg-[#4EBFF7] text-white shadow-lg print-header">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Dental Screening Results
          </h1>
          <p className="text-center text-blue-100 mt-1">
            ReplyQuick Demo Dental Program
          </p>
          <div className="text-center mt-2 text-sm">
            Generated on: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 print-content">
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 text-amber-600 text-xl">ℹ️</div>
              <h3 className="text-lg font-semibold text-amber-800">
                Service Notice
              </h3>
            </div>
            <p className="text-amber-700 mb-2">{error}</p>
            <p className="text-sm text-amber-600">
              The results below are based on general medical guidelines. Try
              again later for our advanced AI screening analysis.
            </p>
          </div>
        )}

        <div
          className="rounded-2xl p-6 md:p-8 shadow-xl border-2 print-card"
          style={{ backgroundColor: config.bgColor, borderColor: config.color }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="p-4 rounded-2xl shrink-0"
              style={{ backgroundColor: config.color + "30" }}
            >
              <Icon
                className="w-8 h-8 md:w-10 md:h-10"
                style={{ color: config.color }}
              />
            </div>
            <div className="flex-1">
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: config.textColor }}
              >
                {config.title}
              </h2>
              <div className="inline-block px-3 py-1 bg-white rounded-full">
                <span
                  className="text-sm font-bold"
                  style={{ color: config.color }}
                >
                  Care Priority: {result.carePriorityScore}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-800 text-lg leading-relaxed">
            {config.message}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            What This Means
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {result.explanation}
          </p>

          {result.detectedIssues && result.detectedIssues.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="font-semibold text-gray-900 mb-2">Areas Noted:</p>
              <ul className="space-y-2">
                {result.detectedIssues.map((issue, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <span className="text-[#4EBFF7] mt-1">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-[#4EBFF7]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-[#4EBFF7] flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                Your Community Partner
              </h3>

              {partnerSource === "B" && (
                <p className="uppercase text-[10px] mt-1 text-slate-500 font-semibold tracking-wide">
                  REPLYQUICK NETWORK PARTNER
                </p>
              )}
              {partnerSource === "A" && (
                <p className="uppercase text-[10px] mt-1 text-slate-500 font-semibold tracking-wide">
                  CHARITY PROGRAM PARTNER
                </p>
              )}
              {partnerSource === "C" && (
                <p className="uppercase text-[10px] mt-1 text-slate-500 font-semibold tracking-wide">
                  COMMUNITY PARTNER
                </p>
              )}
            </div>

            {hasMultiplePartners && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Clinic {activePartnerIndex + 1} of {partners.length}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePartnerIndex((prev) =>
                        prev > 0 ? prev - 1 : prev
                      )
                    }
                    disabled={activePartnerIndex === 0}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm ${
                      activePartnerIndex === 0
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePartnerIndex((prev) =>
                        prev < partners.length - 1 ? prev + 1 : prev
                      )
                    }
                    disabled={activePartnerIndex >= partners.length - 1}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm ${
                      activePartnerIndex >= partners.length - 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {activePartner && (
            <div className="space-y-4 mb-6 mt-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#4EBFF7]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {activePartner.partnerName}
                  </p>
                  <p className="text-gray-600">{activePartner.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#4EBFF7]" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Contact Number:</p>

                  {canTel ? (
                    <a
                      href={`tel:${phoneDigits}`}
                      className="text-[#4EBFF7] font-bold text-lg hover:underline"
                    >
                      {activePartner.contactInfo}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-semibold text-lg">
                      {activePartner.contactInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4EBFF7]" />
              Your Next Steps
            </h4>
            <ol className="space-y-3">
              {result.routingInfo.nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#4EBFF7] text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-[#4EBFF7] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">
                Important Notice
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                This screening is designed to help identify potential dental
                care needs. It is <strong>not a diagnosis</strong>. A
                professional dental evaluation by a licensed dentist is
                recommended for a complete oral health assessment and treatment
                plan.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-6">
          <button
            onClick={handlePrint}
            className="w-full py-4 bg-[#4EBFF7] hover:bg-[#3da8d9] text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            🖨️ Print Results
          </button>
        </div>
      </div>
    </div>
  );
}
