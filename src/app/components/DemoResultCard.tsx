/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

type Finding = { type: string; confidence: number };

const FRIENDLY: Record<
  string,
  { title: string; simple: string; action?: string }
> = {
  Caries: {
    title: "Possible Cavities",
    simple:
      "Some tooth areas look like they might have decay. This is common and treatable.",
    action: "Schedule a dental exam to confirm and discuss treatment options.",
  },
  Gingivitis: {
    title: "Possible Gum Inflammation",
    simple:
      "Your gums may look slightly irritated. This can improve with better cleaning and care.",
    action: "Brush gently along the gumline and consider a dental cleaning.",
  },
  "Mouth Ulcer": {
    title: "Possible Mouth Ulcer",
    simple:
      "There may be a sore/ulcer visible. Most heal on their own, but monitor it.",
    action:
      "If it doesn’t improve within 1–2 weeks, consult a dentist or doctor.",
  },
  "Tooth Discoloration": {
    title: "Possible Tooth Staining",
    simple:
      "Some areas look discolored. This could be staining or lighting effects in photos.",
    action: "Ask your dentist about polishing or whitening options if needed.",
  },
  Hypodontia: {
    title: "Possible Missing Tooth/Tooth Not Present",
    simple:
      "The model thinks a tooth might be missing/not visible in the photos.",
    action:
      "A dentist can confirm if it’s just the photo angle or an actual concern.",
  },
};

function pct(x: number) {
  const v = Math.max(0, Math.min(1, Number(x) || 0));
  return Math.round(v * 100);
}

function barColor(p: number) {
  if (p >= 85) return "bg-emerald-500";
  if (p >= 60) return "bg-amber-500";
  return "bg-slate-400";
}

export default function DemoResultCard({ result }: { result: any }) {
  const rawFindings: Finding[] = Array.isArray(result?.findings)
    ? result.findings
    : Array.isArray(result)
    ? result
    : [];

  const recommendations: string[] = Array.isArray(result?.recommendations)
    ? result.recommendations
    : [];

  const modelVersion: string | null =
    typeof result?.model_version === "string" ? result.model_version : null;

  const sorted = [...rawFindings].sort(
    (a, b) => (b?.confidence ?? 0) - (a?.confidence ?? 0)
  );

  const meaningful = sorted.filter((f) => (f?.confidence ?? 0) >= 0.2);
  const top = (meaningful.length ? meaningful : sorted).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Demo result is ready</h2>
        <p className="text-sm text-gray-600 mt-1">
          Here’s a simple summary based on your photos.
        </p>

        {modelVersion && (
          <p className="text-[11px] text-gray-400 mt-2">Model: {modelVersion}</p>
        )}
      </div>

      <div className="space-y-3">
        {top.length === 0 ? (
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
            We couldn’t detect anything meaningful from these photos. Try retaking
            the images with better lighting.
          </div>
        ) : (
          top.map((f, idx) => {
            const meta = FRIENDLY[f.type] ?? {
              title: f.type,
              simple: "This is a demo signal from the model.",
            };
            const p = pct(f.confidence);
            return (
              <div
                key={`${f.type}-${idx}`}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{meta.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{meta.simple}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-900">{p}%</div>
                    <div className="text-[11px] text-gray-500">confidence</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-2 ${barColor(p)} rounded-full`}
                    style={{ width: `${p}%` }}
                  />
                </div>

                {meta.action && (
                  <div className="mt-3 text-sm text-gray-700">
                    <span className="font-semibold">Next step:</span> {meta.action}
                  </div>
                )}
              </div>
            );
          })
        )}

        {(recommendations?.length ?? 0) > 0 && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="font-semibold text-blue-900 mb-2">Recommended next steps</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-900">
              {recommendations.slice(0, 4).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[12px] text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <span className="font-semibold">Important:</span> This is a demo and not a
          medical diagnosis. Always consult a licensed dentist for confirmation.
        </div>
      </div>
    </div>
  );
}