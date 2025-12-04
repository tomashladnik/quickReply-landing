/* eslint-disable @next/next/no-img-element */
// src/app/components/patientImageCapture.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface PatientImageCaptureProps {
  token: string;
  patientName: string;
  onComplete: () => void;
  onBack: () => void;
}

type Slot = {
  blob: Blob | null;
  preview: string | null;
  uploaded: boolean;
};

const makeEmptySlot = (): Slot => ({
  blob: null,
  preview: null,
  uploaded: false,
});

const LABELS = ["Left", "Right", "Center", "Upper", "Lower"] as const;

const MICROCOPY: Record<string, string> = {
  Left: "Hold the phone near your left cheek and show your left side teeth.",
  Right: "Hold the phone near your right cheek and show your right side teeth.",
  Center: "Open your mouth and center your front teeth in the frame.",
  Upper: "Tilt the phone downward and show your upper teeth. Open wide.",
  Lower: "Tilt the phone upward and show your lower teeth. Open wide.",
};

export default function PatientImageCapture({
  token,
  patientName,
  onComplete,
  onBack,
}: PatientImageCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [camStarting, setCamStarting] = useState(false);

  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: 5 }, () => makeEmptySlot())
  );
  const [current, setCurrent] = useState<number>(0);

  const filledCount = slots.filter((s) => !!s.blob).length;
  const canSubmit = filledCount === 5;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (camStarting || camReady) return;
    setCamError(null);
    setCamStarting(true);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { exact: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play().catch(() => {});
      setCamReady(true);
    } catch (e: any) {
      setCamError(
        e?.name === "NotAllowedError"
          ? "Camera permission was denied."
          : e?.name === "NotFoundError"
            ? "No camera found."
            : "Could not start camera."
      );
    } finally {
      setCamStarting(false);
    }
  }, [camStarting, camReady]);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCamReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const label = LABELS[current];

  async function capture() {
    const v = videoRef.current;
    if (!v) return;

    const W = 960;
    const H = 1280;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const vw = v.videoWidth || 1280;
    const vh = v.videoHeight || 720;
    const stageAR = W / H;
    const camAR = vw / vh;
    let sx = 0,
      sy = 0,
      sw = vw,
      sh = vh;
    if (camAR > stageAR) {
      const targetW = vh * stageAR;
      sx = (vw - targetW) / 2;
      sw = targetW;
    } else {
      const targetH = vw / stageAR;
      sy = (vh - targetH) / 2;
      sh = targetH;
    }

    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, W, H);

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b as Blob), "image/jpeg", 0.9)
    );
    const url = URL.createObjectURL(blob);

    setSlots((prev) => {
      const next = [...prev];
      if (next[current]?.preview) {
        try {
          URL.revokeObjectURL(next[current]!.preview as string);
        } catch {}
      }
      next[current] = {
        ...next[current],
        blob,
        preview: url,
        uploaded: false,
      };
      return next;
    });

    // Upload to backend so ML can use it
    try {
      setSubmitError(null);
      const formData = new FormData();
      formData.append("image", blob, `${label.toLowerCase()}.jpg`);
      formData.append("label", label.toLowerCase());
      formData.append("token", token);

      const uploadRes = await fetch("/api/demo/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text().catch(() => "");
        console.error("Upload failed:", text);
        setSubmitError(
          `Failed to upload ${label.toLowerCase()} image. Please try again.`
        );
        return;
      }

      setSlots((prev) => {
        const next = [...prev];
        next[current] = {
          ...next[current],
          uploaded: true,
        };
        return next;
      });
    } catch (e) {
      console.error("Upload error:", e);
      setSubmitError(
        `Failed to upload ${label.toLowerCase()} image. Please try again.`
      );
      return;
    }

    setCurrent((i) => Math.min(i + 1, 4));
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/demo/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit images");
      }

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCamReady(false);

      onComplete();
    } catch (e: any) {
      console.error(e);
      setSubmitError(e?.message || "Failed to submit photos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Compact Header */}
      <div className="px-3 py-2 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold truncate">
              Capture 5 Sample Photos
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
              Experience DentalScan - Step {current + 1}/5: {label}
            </p>
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-[#4ebff7] whitespace-nowrap">
            {filledCount}/5
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 py-3 space-y-2 max-w-md mx-auto pb-6">
        {/* Instructions */}
        <div className="text-center">
          <p className="text-xs text-gray-600">{MICROCOPY[label]}</p>
          <p className="text-[10px] sm:text-xs mt-0.5 font-medium text-gray-500">
            Hold still and keep your teeth inside the guide.
          </p>
        </div>

        {/* Camera Preview */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-3/4 rounded-lg overflow-hidden bg-black shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] sm:text-xs font-medium">
              {label}
            </div>
            {!camReady && !camError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white px-4">
                  <svg
                    className="animate-spin h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-xs">Starting camera...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Capture Button */}
        <div className="max-w-[280px] sm:max-w-[320px] mx-auto">
          <button
            onClick={capture}
            disabled={!camReady}
            className={`w-full py-2.5 rounded-lg text-white text-xs sm:text-sm font-semibold transition-colors shadow-md ${
              !camReady
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4ebff7] hover:bg-[#3da8d9] active:bg-[#2a95c5]"
            }`}
          >
            📸 Capture {label}
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap">
          {LABELS.map((L, i) => {
            const s = slots[i];
            const isCurrent = i === current;
            const isFilled = !!s.preview;

            return (
              <button
                key={L}
                type="button"
                onClick={() => setCurrent(i)}
                className={`relative w-[52px] sm:w-14 rounded border-2 p-0.5 transition-all ${
                  isCurrent
                    ? "border-[#4ebff7] bg-blue-50"
                    : isFilled
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white"
                }`}
              >
                <div className="text-[8px] sm:text-[9px] mb-0.5 font-medium text-center truncate">
                  {L}
                </div>
                <div className="aspect-3/4 w-full overflow-hidden rounded-sm border border-gray-200">
                  {s.preview ? (
                    <img
                      src={s.preview}
                      alt={L}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        📷
                      </span>
                    </div>
                  )}
                </div>
                {isFilled && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] sm:text-[9px]">
                      ✓
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Error Messages */}
        {(camError || submitError) && (
          <div className="max-w-[280px] sm:max-w-[320px] mx-auto">
            {camError && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 mb-2">
                {camError}
                <button
                  onClick={startCamera}
                  className="ml-2 text-[#4ebff7] font-semibold hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}
            {submitError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-1.5 max-w-md mx-auto pt-2">
          <button
            onClick={() => setCurrent((i) => Math.max(0, i - 1))}
            disabled={current === 0}
            className={`flex-1 py-2 rounded border text-[11px] sm:text-xs font-medium transition-colors ${
              current === 0
                ? "border-gray-200 text-gray-400 bg-gray-100"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrent((i) => Math.min(i + 1, 4))}
            disabled={current === 4}
            className={`flex-1 py-2 rounded border text-[11px] sm:text-xs font-medium transition-colors ${
              current === 4
                ? "border-gray-200 text-gray-400 bg-gray-100"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next →
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex-1 py-2 rounded border border-gray-300 text-[11px] sm:text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`flex-1 py-2 rounded text-[11px] sm:text-xs font-semibold transition-colors ${
              !canSubmit || submitting
                ? "bg-gray-300 text-gray-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {submitting
              ? "Submitting…"
              : canSubmit
                ? "Submit"
                : `Submit (${filledCount}/5)`}
          </button>
        </div>
      </div>
    </div>
  );
}
