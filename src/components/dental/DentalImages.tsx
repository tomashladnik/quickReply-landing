// src/components/dental/patient/steps/DentalImages.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMediaPipeFaceDetection } from "@/hooks/useMediaPipeFaceDetection";
import {
  useDentalCaptureGuardrail,
  type ViewType,
} from "@/hooks/useDentalCaptureGuardrail";
import { performQualityChecks } from "@/lib/dental/qualityGuardrails";
import { FaceAlignmentOverlay } from "@/components/dental/FaceAlignmentOverlay";

// Define the props interface for step components
export interface StepComponentProps {
  state?: any;
  setState?: (updater: any) => void;
  onNext?: (data?: any) => void;
  onBack?: () => void;
}

type Slot = {
  blob: Blob | null;
  preview: string | null;
  filePath: string | null;
  uploaded: boolean;
  metadata?: {
    viewType: "front" | "left" | "right" | "upper" | "lower";
    clientQuality: {
      blurScore: number;
      brightnessScore: number;
      faceCenteredScore: number; // 0-1
      mouthOpenScore: number; // 0-1
    };
    captureTimestamp: string;
    triggeredBy: "auto" | "manual";
    mediaDetection: {
      faceConfidence: number;
      mouthOpenness: number;
    };
  };
};

const makeEmptySlot = (): Slot => ({
  blob: null,
  preview: null,
  filePath: null,
  uploaded: false,
});

// UI labels for the 5 captures - matching specification exactly
const VIEWS = [
  {
    type: "front" as ViewType,
    label: "Front View",
    instruction: "Look straight at the camera and show your teeth gently.",
  },
  {
    type: "left" as ViewType,
    label: "Left View",
    instruction: "Turn your head slightly to the LEFT and show your teeth.",
  },
  {
    type: "right" as ViewType,
    label: "Right View",
    instruction: "Turn your head slightly to the RIGHT and show your teeth.",
  },
  {
    type: "upper" as ViewType,
    label: "Upper Teeth",
    instruction:
      "Tilt your head BACK and open your mouth WIDE to show your upper teeth.",
  },
  {
    type: "lower" as ViewType,
    label: "Lower Teeth",
    instruction:
      "Tilt your head SLIGHTLY FORWARD and open your mouth WIDE to show all your lower teeth including the back ones.",
  },
];

// ML view type mapping for backend
const VIEW_MAP: Record<ViewType, string> = {
  front: "front",
  left: "left",
  right: "right",
  upper: "top",
  lower: "bottom",
};

// Stable setState function to prevent re-renders
const createStableSetState = (originalSetState: any) => {
  return (updater: any) => {
    setTimeout(() => {
      if (typeof updater === "function") {
        originalSetState(updater);
      } else {
        originalSetState(() => updater);
      }
    }, 0);
  };
};

export default function DentalImages({
  state,
  setState: originalSetState,
  onNext,
  onBack,
}: StepComponentProps) {
  const scanLinkToken: string = (state?.scanLinkToken as string) || "";
  const patientName: string = (state?.patientName as string) || "Patient";

  // Stable setState to prevent infinite re-renders
  const stableSetState = useCallback(
    createStableSetState(originalSetState),
    [originalSetState]
  );

  const videoRef = useRef<HTMLVideoElement>(null!);
  const streamRef = useRef<MediaStream | null>(null);
  const noFaceTimeoutRef = useRef(0);

  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [camStarting, setCamStarting] = useState(false);
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: 5 }, () => makeEmptySlot())
  );
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitStage, setSubmitStage] = useState<
    "idle" | "uploading" | "analyzing" | "loading_results"
  >("idle");

  const filledCount = slots.filter((s) => !!s.blob).length;
  const canSubmit = filledCount === 5;
  const allPhotosCaptured = filledCount === 5;
  const currentView = VIEWS[currentStep];

  // MediaPipe face detection with specification-compliant settings
  const faceDetection = useMediaPipeFaceDetection(videoRef, {
    enabled: camReady,
    processingInterval: 67, // ~15 FPS as per specification
  });

  // Quality checks for guardrails
  const [qualityChecks, setQualityChecks] = useState({
    blur: true,
    brightness: true,
    exposure: true,
  });

  // Dental capture guardrail system
  const guardrail = useDentalCaptureGuardrail(
    faceDetection?.result || {
      faceCenter: null,
      mouthLandmarks: null,
      mouthBoundingBox: null,
      mouthOpenness: 0,
      faceDetected: false,
      confidence: 0,
      multipleFacesDetected: false,
      faceCount: 0,
    },
    qualityChecks,
    {
      viewType: currentView.type,
      stabilityFrames: 15, // ~1 second at 15fps
    }
  );

  // Update state when slots change (with stable setState)
  useEffect(() => {
    stableSetState((prev: any) => ({
      ...(prev || {}),
      photos: { ...(prev?.photos ?? {}), slots },
      validity: { ...(prev?.validity ?? {}), photos: canSubmit },
    }));
  }, [slots, canSubmit]);

  // Camera initialization
  useEffect(() => {
    const startCamera = async () => {
      if (camStarting || (camReady && streamRef.current)) return;

      setCamError(null);
      setCamStarting(true);

      try {
        const v = videoRef.current;
        if (!v) {
          throw new Error("Video element not available");
        }

        // Stop any existing stream first
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Clear any existing srcObject to prevent interference
        if (v.srcObject) {
          v.srcObject = null;
          v.load(); // Reset the video element
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        v.srcObject = stream;

        const playPromise = v.play();

        if (playPromise !== undefined) {
          try {
            await playPromise;
            setCamReady(true);
          } catch (playError: any) {
            if (
              playError.name === "AbortError" ||
              (playError.message || "").includes("interrupted")
            ) {
              await new Promise((resolve) => {
                const handleCanPlay = () => {
                  v.removeEventListener("canplay", handleCanPlay);
                  resolve(void 0);
                };
                v.addEventListener("canplay", handleCanPlay);
              });
              await v.play();
              setCamReady(true);
            } else {
              throw playError;
            }
          }
        } else {
          setCamReady(true);
        }
      } catch (e: any) {
        const errorMessage =
          e?.name === "NotAllowedError"
            ? "Camera permission was denied."
            : e?.name === "NotFoundError"
            ? "No camera found."
            : e?.name === "NotReadableError"
            ? "Camera is being used by another application."
            : `Could not start camera: ${e?.message || "Unknown error"}`;

        setCamError(errorMessage);
      } finally {
        setCamStarting(false);
      }
    };

    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCamReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop camera when all photos captured
  useEffect(() => {
    if (allPhotosCaptured && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCamReady(false);
    }
  }, [allPhotosCaptured]);

  // Face detection timeout and multiple face detection
  useEffect(() => {
    if (!faceDetection?.result?.faceDetected) {
      noFaceTimeoutRef.current++;
    } else {
      noFaceTimeoutRef.current = 0;
      setMultipleFaces(false);
    }
  }, [faceDetection?.result]);

  // Quality checks loop
  useEffect(() => {
    if (!camReady || !videoRef.current) return;

    let frameId: number;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const v = videoRef.current;
      if (!v || !ctx || v.videoWidth === 0 || v.videoHeight === 0) {
        frameId = requestAnimationFrame(loop);
        return;
      }

      const qualityResult = performQualityChecks(
        v,
        {
          minBlurScore: 30,
          minBrightness: 20,
          maxBrightness: 240,
          minContrast: 10,
        },
        canvas
      );

      setQualityChecks(qualityResult);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [camReady]);

  // Capture photo function
  const capturePhoto = useCallback(
    async (triggeredBy: "auto" | "manual") => {
      const v = videoRef.current;
      if (!v) return;

      try {
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
          if (next[currentStep]?.preview) {
            try {
              URL.revokeObjectURL(next[currentStep]!.preview as string);
            } catch {}
          }
          next[currentStep] = {
            ...next[currentStep],
            blob,
            preview: url,
            uploaded: false,
            filePath: null,
            metadata: {
              viewType: currentView.type,
              clientQuality: {
                blurScore: qualityChecks?.blur ? 0 : 1,
                brightnessScore: qualityChecks?.brightness ? 1 : 0,
                faceCenteredScore: faceDetection?.result?.faceDetected
                  ? Math.min(1.0, faceDetection.result.confidence)
                  : 0,
                mouthOpenScore: faceDetection?.result?.mouthOpenness || 0,
              },
              captureTimestamp: new Date().toISOString(),
              triggeredBy,
              mediaDetection: {
                faceConfidence: faceDetection?.result?.confidence || 0,
                mouthOpenness: faceDetection?.result?.mouthOpenness || 0,
              },
            },
          };
          return next;
        });

        setCurrentStep((i) => Math.min(i + 1, 4));
      } catch (error) {
        console.error("Error during capture:", error);
      }
    },
    [currentStep]
  );

  // Auto-capture logic - simplified to work with guardrail countdown
  useEffect(() => {
    if (
      guardrail?.readyToCapture &&
      !autoCapturing &&
      !slots[currentStep]?.blob
    ) {
      setAutoCapturing(true);

      capturePhoto("auto").finally(() => {
        setAutoCapturing(false);
        if (guardrail?.startCooldown) {
          guardrail.startCooldown();
        }
      });
    }
  }, [
    guardrail?.readyToCapture,
    autoCapturing,
    currentStep,
    slots,
    capturePhoto,
    guardrail?.startCooldown,
  ]);

  // Status message logic - specification compliant
  const getStatusMessage = () => {
    if (camError)
      return { text: "Camera not available", color: "bg-red-100 text-red-700" };
    if (noFaceTimeoutRef.current > 50)
      return {
        text: "We can't see your face. Please adjust your camera.",
        color: "bg-red-100 text-red-700",
      };
    if (multipleFaces)
      return {
        text: "Make sure only one person is in the frame",
        color: "bg-orange-100 text-orange-700",
      };
    if (!faceDetection?.result?.faceDetected)
      return { text: "Looking for your face...", color: "bg-blue-100 text-blue-700" };
    if (!guardrail?.faceAligned)
      return {
        text: "Center your face in the circle",
        color: "bg-yellow-100 text-yellow-700",
      };
    if (!guardrail?.mouthValid) {
      if (
        faceDetection?.result?.mouthBoundingBox &&
        faceDetection.result.mouthBoundingBox.y > 0.7
      ) {
        return {
          text: "Lower the phone to include your mouth",
          color: "bg-yellow-100 text-yellow-700",
        };
      }
      return { text: "Open your mouth slightly", color: "bg-yellow-100 text-yellow-700" };
    }
    if (!guardrail?.qualityOk) {
      if (!qualityChecks.brightness) {
        return { text: "Too dark – move to better lighting", color: "bg-yellow-100 text-yellow-700" };
      }
      if (!qualityChecks.exposure) {
        return { text: "Too bright – reduce light behind you", color: "bg-yellow-100 text-yellow-700" };
      }
      if (!qualityChecks.blur) {
        return { text: "Image too blurry – hold still or move closer", color: "bg-yellow-100 text-yellow-700" };
      }
      return { text: "Image quality needs improvement", color: "bg-yellow-100 text-yellow-700" };
    }
    if (guardrail?.countdown > 0)
      return { text: `Hold still... capturing in ${guardrail.countdown}`, color: "bg-green-100 text-green-700" };
    if (guardrail?.readyToCapture)
      return { text: "Capturing now!", color: "bg-green-100 text-green-700" };
    return { text: "Position yourself in the circle", color: "bg-sky-100 text-sky-700" };
  };

  const handleManualCapture = useCallback(() => {
    capturePhoto("manual");
  }, [capturePhoto]);

  const getSubmitStageText = () => {
    if (submitStage === "uploading") return "Uploading images…";
    if (submitStage === "analyzing") return "Analyzing your photos…";
    if (submitStage === "loading_results") return "Loading your results…";
    return "Submitting…";
  };

  const getSubmitStageSubtext = () => {
    if (submitStage === "uploading")
      return "Please keep this page open while we securely upload your images.";
    if (submitStage === "analyzing")
      return "Your dental scan images are being processed. This usually takes a few seconds.";
    if (submitStage === "loading_results")
      return "Almost done — fetching your demo results.";
    return "Please keep this page open.";
  };

  const getStageProgress = () => {
    if (submitStage === "uploading") return 33;
    if (submitStage === "analyzing") return 66;
    if (submitStage === "loading_results") return 95;
    return 10;
  };

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    if (!scanLinkToken) {
      setSubmitError("Missing scan link token.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitStage("uploading");

    try {
      const isJWTToken = scanLinkToken && scanLinkToken.includes(".");
      const isDentalDemo = isJWTToken;
      const isMultiuseCase = !isJWTToken;

      let verifyRes;

      if (isDentalDemo) {
        const response = await fetch("/api/demo/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: scanLinkToken }),
        }).then((r) => r.json());

        if (response?.error) throw new Error(response.error);

        verifyRes = {
          ok: true,
          link: { businessId: "demo-business" },
          scanId: response.scanId,
          patient_name: response.patient_name,
        };
      } else {
        verifyRes = {
          ok: true,
          link: { businessId: "multiuse-business" },
          scanId: scanLinkToken,
          patient_name: patientName,
        };
      }

      if (!verifyRes?.ok) throw new Error("Token verification failed");

      const patientId = verifyRes.scanId || "demo-patient";

      const invalidSlots = slots
        .filter((s) => !s.blob)
        .map((_, i) => VIEWS[i]?.type || `slot${i}`);
      if (invalidSlots.length > 0) {
        throw new Error(
          `Missing images for: ${invalidSlots.join(
            ", "
          )}. Please capture all required photos.`
        );
      }

      const blobs = slots.map((s) => s.blob!);
      const uploadResults: any[] = [];

      let userData: { name: any; phone: any; flowType: string } = {
        name: null,
        phone: null,
        flowType: "gym",
      };

      if (isMultiuseCase) {
        const userInfoRes = await fetch(
          `/api/multiuse/user-info?userId=${scanLinkToken}`
        );

        if (!userInfoRes.ok) {
          const errorData = await userInfoRes.json();
          throw new Error(errorData.error || "Failed to fetch user information");
        }

        const user = await userInfoRes.json();
        userData = user.user || user;

        if (!userData.name || !userData.phone) {
          throw new Error("User information incomplete - missing name or phone");
        }
      }

      // Upload images
      for (let i = 0; i < blobs.length; i++) {
        const formData = new FormData();

        if (!blobs[i]) {
          throw new Error(
            `No image captured for ${
              VIEWS[i]?.type || `view ${i + 1}`
            }. Please capture all required photos.`
          );
        }

        if (isDentalDemo) {
          formData.append("token", scanLinkToken);
          formData.append("image", blobs[i], `${VIEWS[i].type}.jpg`);
          formData.append("label", VIEWS[i].type);

          const uploadRes = await fetch("/api/demo/upload", {
            method: "POST",
            body: formData,
          }).then((r) => r.json());

          if (uploadRes.error) {
            throw new Error(
              `Upload failed for ${VIEWS[i].type}: ${uploadRes.error}`
            );
          }

          uploadResults.push({
            viewType: VIEWS[i].type,
            imageUrl: uploadRes.imageUrl,
            scanId: uploadRes.scanId || patientId,
          });
        } else {
          formData.append("scanId", scanLinkToken);
          formData.append("index", i.toString());
          formData.append("file", blobs[i], `${VIEWS[i].type}-${i + 1}.jpg`);
          formData.append("flowType", userData.flowType || "gym");

          const uploadRes = await fetch("/api/multiuse/upload", {
            method: "POST",
            body: formData,
          }).then((r) => r.json());

          if (!uploadRes.ok) {
            throw new Error(uploadRes.error || `Upload failed for ${VIEWS[i].type}`);
          }

          uploadResults.push({
            viewType: VIEWS[i].type,
            imageUrl: uploadRes.url,
            scanId: scanLinkToken,
          });
        }
      }

      setSubmitStage("analyzing");

      // Submit all images
      if (isDentalDemo) {
        const imageUrls = uploadResults.map((result) => result.imageUrl);

        const submitRes = await fetch("/api/demo/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: scanLinkToken,
            imageUrls,
          }),
        });

        const submitData = await submitRes.json().catch(() => null);

        if (!submitRes.ok) {
          const msg =
            submitData?.error || submitData?.message || "Submit failed";
          throw new Error(msg);
        }

        setSubmitStage("loading_results");

        stableSetState((prev: any) => ({
          ...(prev || {}),
          finalizedAt: new Date().toISOString(),
          result: submitData?.result ?? submitData,
        }));

        onNext?.(submitData);
        return;
      } else {
        const imageData = uploadResults.map((_, index) => ({
          view: VIEWS[index].type.toLowerCase(),
          filePath: `${
            userData.flowType === "charity" ? "Charity" : "Gym"
          }/${scanLinkToken}/${scanLinkToken}/images/view-${index + 1}.jpg`,
        }));

        const scanRes = await fetch("/api/multiuse/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scanId: scanLinkToken,
            flowType: userData.flowType,
            userId: scanLinkToken,
            phone: userData.phone,
            images: imageData,
          }),
        });

        if (!scanRes.ok) {
          const errorText = await scanRes.text();
          console.error("Scan analysis error:", scanRes.status, errorText);

          const resultRes = await fetch("/api/multiuse/send-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: scanLinkToken,
              phone: userData.phone,
              name: userData.name,
              flowType: userData.flowType,
              result: {
                currentStatus: "Assessment completed",
                recommendedPlan: "Personalized fitness plan based on photos",
                progressScore: "Available in app",
              },
            }),
          });

          if (!resultRes.ok) {
            const resultErrorText = await resultRes.text();
            throw new Error(`Failed to send result: ${resultErrorText}`);
          }
        } else {
          await scanRes.json().catch(() => null);
        }

        stableSetState((prev: any) => ({
          ...(prev || {}),
          finalizedAt: new Date().toISOString(),
        }));
        onNext?.();
      }
    } catch (e: any) {
      console.error(e);
      setSubmitError(e?.message || "Failed to submit photos.");
    } finally {
      setSubmitting(false);
      setSubmitStage("idle");
    }
  }, [canSubmit, submitting, scanLinkToken, patientName, slots, stableSetState, onNext]);

  const status = getStatusMessage();

  return (
    <div className="w-full max-w-lg mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-blue-100 overflow-hidden">
      {submitting && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#4ebff7] text-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="animate-spin w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.9"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">{getSubmitStageText()}</div>
                  <div className="text-xs text-white/90">
                    {getSubmitStageSubtext()}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="space-y-2">
                <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#4ebff7] rounded-full transition-all duration-500"
                    style={{ width: `${getStageProgress()}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Uploading images → AI analysis → Loading results
                </div>
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
                This is a demo and not a medical diagnosis. Always consult a
                licensed dentist for confirmation.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header - Specification Compliant */}
      <div className="bg-sky-400 text-white p-6 md:p-8 text-center -mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-6">
        <h2 className="text-2xl font-bold mb-1">DentalScan</h2>
        <p className="text-sm text-sky-100 mb-0">
          Step {currentStep + 1} of 5 – {currentView.label}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-2">
        {VIEWS.map((view, i) => (
          <div
            key={view.type}
            className="flex-1 h-2 rounded-full bg-blue-100 overflow-hidden"
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                i < filledCount
                  ? "bg-green-400"
                  : i === currentStep
                  ? "bg-blue-500"
                  : "bg-blue-200"
              }`}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>

      {/* View Labels */}
      <div className="flex justify-between text-xs text-blue-400 mb-2">
        {VIEWS.map((view, i) => (
          <span
            key={view.type}
            className={i === currentStep ? "text-blue-700 font-bold" : ""}
          >
            {view.type.charAt(0).toUpperCase() + view.type.slice(1)}
          </span>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-center text-gray-700">{currentView.instruction}</p>
      </div>

      {/* Status Indicator */}
      <div className="flex justify-center p-2">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${status.color}`}
        >
          {status.text}
        </div>
      </div>

      {/* Camera Preview */}
      <div className="flex justify-center mb-2">
        <div className="relative w-full max-w-[280px] aspect-3/4 rounded-xl overflow-hidden bg-black shadow-md border-2 border-blue-200">
          {allPhotosCaptured ? (
            <div className="w-full h-full bg-linear-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center text-center p-6">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold text-green-700 mb-2">
                All Photos Captured!
              </h3>
              <p className="text-sm text-green-600 mb-4">
                Ready to submit your dental images
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />

              {camReady && !faceDetection?.isLoading && (
                <FaceAlignmentOverlay
                  faceDetection={faceDetection?.result}
                  guardrail={guardrail}
                  videoRef={videoRef}
                  circleRadius={
                    guardrail.circleRadius ? guardrail.circleRadius * 100 : 0
                  }
                  className="z-10"
                />
              )}

              <div className="absolute top-2 left-2 bg-blue-700/80 text-white px-3 py-1 rounded text-xs font-semibold z-20">
                {currentView.label}
              </div>

              {guardrail?.countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {guardrail.countdown}
                    </span>
                  </div>
                </div>
              )}

              {faceDetection?.isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                  <div className="text-white text-sm">
                    Loading face detection...
                  </div>
                </div>
              )}

              {faceDetection?.error && (
                <div className="absolute bottom-2 left-2 right-2 bg-yellow-600/90 text-white px-3 py-2 rounded text-sm z-20">
                  <div className="font-medium">
                    Manual mode - Auto-capture disabled
                  </div>
                  <div className="text-xs mt-1">
                    {currentView.type === "upper" || currentView.type === "lower"
                      ? "Open your mouth wide and position yourself for dental arch photos."
                      : "Position your face centered with natural expression."}
                  </div>
                </div>
              )}

              {faceDetection?.result?.multipleFacesDetected &&
                faceDetection?.result?.faceCount > 1 && (
                  <div className="absolute top-2 left-2 right-2 bg-orange-600/90 text-white px-3 py-2 rounded text-sm z-25">
                    <div className="font-medium">
                      ⚠️ Multiple faces detected ({faceDetection.result.faceCount})
                    </div>
                    <div className="text-xs mt-1">
                      Make sure only one person is in the frame for best dental
                      photos.
                    </div>
                  </div>
                )}

              {!faceDetection?.error && guardrail && (
                <div className="absolute bottom-2 left-2 right-2 bg-sky-500/90 text-white px-3 py-2 rounded text-sm z-20">
                  <div className="font-medium">
                    {faceDetection?.result?.multipleFacesDetected && (
                      <span className="text-yellow-300">
                        ⚠️ Multiple faces detected -{" "}
                      </span>
                    )}
                    {guardrail.readyToCapture
                      ? "Perfect! Photo will capture automatically..."
                      : guardrail.countdown > 0
                      ? `Hold steady... ${guardrail.countdown}`
                      : guardrail.inCooldown
                      ? "Adjusting position..."
                      : "Auto-capture active - Position yourself"}
                  </div>
                  <div className="text-xs mt-1">
                    {faceDetection?.result?.multipleFacesDetected
                      ? "Only one person should be in frame for best dental photos."
                      : currentView.type === "upper" ||
                        currentView.type === "lower"
                      ? "Keep mouth open wide and steady for clear dental arch visibility."
                      : currentView.type === "front"
                      ? "Look straight ahead with relaxed, natural expression."
                      : `Turn your head to show ${currentView.type} profile with mouth slightly open.`}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Manual Capture Button */}
      {!allPhotosCaptured && (
        <div className="p-4 bg-white">
          <button
            onClick={handleManualCapture}
            disabled={autoCapturing || submitting}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white rounded-lg font-medium"
          >
            {autoCapturing ? "Capturing..." : "📸 Capture Photo"}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            {faceDetection?.result?.multipleFacesDetected
              ? "⚠️ Multiple faces detected - ensure only one person is in frame for best results."
              : currentView.type === "upper" || currentView.type === "lower"
              ? "Open mouth wide to show dental arches clearly. Keep steady for sharp focus."
              : currentView.type === "front"
              ? "Face camera directly with natural expression for frontal reference."
              : `Show your ${currentView.type} side profile with mouth slightly open for clear view.`}
          </p>
        </div>
      )}

      {/* Thumbnails */}
      <div className="flex gap-2 justify-center mb-2">
        {VIEWS.map((view, i) => {
          const s = slots[i];
          const isCurrent = i === currentStep;
          const isFilled = !!s?.preview;
          return (
            <button
              key={view.type}
              type="button"
              onClick={() => setCurrentStep(i)}
              disabled={submitting}
              className={`relative w-14 rounded-lg border-2 p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isCurrent
                  ? "border-sky-600 bg-sky-50"
                  : isFilled
                  ? "border-green-500 bg-green-50"
                  : "border-sky-200 bg-white"
              } ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="text-[10px] mb-0.5 font-medium text-center truncate text-sky-700">
                {view.type.charAt(0).toUpperCase() + view.type.slice(1)}
              </div>
              <div className="aspect-3/4 w-full overflow-hidden rounded border border-sky-100 bg-sky-50">
                {s?.preview ? (
                  <img
                    src={s.preview}
                    alt={view.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sky-300 text-lg">📷</span>
                  </div>
                )}
              </div>
              {isFilled && (
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Error Messages */}
      {(camError || submitError) && (
        <div>
          {camError && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-1">
              {camError}
            </div>
          )}
          {submitError && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded px-2 py-1">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* Navigation & Submit */}
      <div className="mt-6 flex flex-col md:flex-row gap-3 md:justify-between">
        <button
          onClick={onBack}
          disabled={submitting}
          className={`w-full md:w-auto px-4 py-2 rounded-lg border border-sky-200 bg-white text-sky-700 font-semibold shadow-sm hover:bg-sky-50 transition ${
            submitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={`w-full md:w-auto px-4 py-2 rounded-lg font-semibold shadow-sm transition text-white ${
            !canSubmit || submitting
              ? "bg-sky-200 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting
            ? getSubmitStageText()
            : canSubmit
            ? "✓ Submit Photos"
            : `Submit (${filledCount}/5)`}
        </button>
      </div>
    </div>
  );
}