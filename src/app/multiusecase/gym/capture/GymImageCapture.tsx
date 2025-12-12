'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  FormEvent,
} from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { uploadMultiuseImage } from '@/lib/dental/multiuse/upload';

type ViewType = 'front' | 'left' | 'right' | 'upper' | 'lower';

const VIEWS: ViewType[] = ['front', 'left', 'right', 'upper', 'lower'];

const VIEW_LABELS: Record<ViewType, string> = {
  front: 'Front',
  left: 'Left',
  right: 'Right',
  upper: 'Upper',
  lower: 'Lower',
};

const VIEW_INSTRUCTIONS: Record<ViewType, string> = {
  front: 'Look straight and show teeth',
  left: 'Turn head LEFT, show teeth',
  right: 'Turn head RIGHT, show teeth',
  upper: 'Tilt back, show UPPER teeth',
  lower: 'Tilt forward, show LOWER teeth',
};

type CaptureSlot = {
  blob: Blob | null;
  preview: string | null;
};

interface GymImageCaptureProps {
  scanId: string;
  userId: string;
  onComplete: () => void;
  onBack: () => void;
  phone?: string; // for SMS later in /api/multiuse/scan
}

export default function GymImageCapture({
  scanId,
  userId,
  onComplete,
  onBack,
  phone,
}: GymImageCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stableFramesRef = useRef(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState<CaptureSlot[]>(
    VIEWS.map(() => ({ blob: null, preview: null }))
  );

  const [cameraReady, setCameraReady] = useState(false);
  const [mediaPipeReady, setMediaPipeReady] = useState(false);

  const [faceDetected, setFaceDetected] = useState(false);
  const [faceInCircle, setFaceInCircle] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [captureMode, setCaptureMode] = useState<'auto' | 'manual'>('manual');
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);
  const [autoDetectionActive, setAutoDetectionActive] = useState(false);

  const currentView = VIEWS[currentIndex];
  const capturedCount = slots.filter((s) => s.blob !== null).length;
  const canSubmit = capturedCount === 5;

  // ---------- MediaPipe init ----------
  useEffect(() => {
    let mounted = true;

    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
          }
        );

        if (mounted) {
          faceLandmarkerRef.current = faceLandmarker;
          setMediaPipeReady(true);
        }
      } catch (error) {
        console.error('MediaPipe error:', error);
        if (mounted) setMediaPipeReady(true);
      }
    }

    initMediaPipe();

    return () => {
      mounted = false;
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  // ---------- Start camera ----------
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraReady(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [startCamera]);

  // ---------- Detection loop ----------
  useEffect(() => {
    if (
      !cameraReady ||
      !mediaPipeReady ||
      !videoRef.current ||
      !faceLandmarkerRef.current
    )
      return;

    let lastProcessTime = 0;
    const processInterval = 150;

    const detect = async (timestamp: number) => {
      if (!videoRef.current || !faceLandmarkerRef.current) return;

      if (timestamp - lastProcessTime < processInterval) {
        animationFrameRef.current = requestAnimationFrame(detect);
        return;
      }
      lastProcessTime = timestamp;

      try {
        const results = faceLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );
        processDetectionResults(results);
      } catch {
        // ignore
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    animationFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraReady, mediaPipeReady, isCapturing]);

  function processDetectionResults(results: any) {
    if (isCapturing) return;

    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      setFaceDetected(false);
      setFaceInCircle(false);
      setMouthOpen(false);
      stableFramesRef.current = 0;
      return;
    }

    const landmarks = results.faceLandmarks[0];
    const noseTip = landmarks[1];

    const distance = Math.sqrt(
      Math.pow(noseTip.x - 0.5, 2) + Math.pow(noseTip.y - 0.4, 2)
    );
    const isInCircle = distance < 0.25;

    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const mouthOpenness = Math.abs(upperLip.y - lowerLip.y);
    const isOpen = mouthOpenness > 0.025;

    if (faceDetected !== true) setFaceDetected(true);
    if (faceInCircle !== isInCircle) setFaceInCircle(isInCircle);
    if (mouthOpen !== isOpen) setMouthOpen(isOpen);

    if (
      captureMode === 'auto' &&
      autoDetectionActive &&
      isInCircle &&
      isOpen &&
      !isCapturing
    ) {
      stableFramesRef.current++;
      if (stableFramesRef.current >= 3) {
        triggerAutoCapture();
      }
    } else {
      stableFramesRef.current = 0;
    }
  }

  function triggerAutoCapture() {
    if (isCapturing) return;

    setIsCapturing(true);
    stableFramesRef.current = 0;

    captureTimeoutRef.current = setTimeout(() => {
      captureImage();
      setIsCapturing(false);
    }, 800);
  }

  function captureImage() {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d')!;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const aspectRatio = 960 / 1280;
    let sx = 0,
      sy = 0,
      sw = vw,
      sh = vh;

    if (vw / vh > aspectRatio) {
      sw = vh * aspectRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / aspectRatio;
      sy = (vh - sh) / 2;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 960, 1280);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        setSlots((prev) => {
          const next = [...prev];
          if (next[currentIndex].preview) {
            URL.revokeObjectURL(next[currentIndex].preview!);
          }
          next[currentIndex] = { blob, preview: url };
          return next;
        });

        if (currentIndex < 4) {
          setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
        }
      },
      'image/jpeg',
      0.95
    );
  }

  function manualCapture() {
    if (isCapturing) return;
    captureImage();
  }

  function handleAutoModeToggle() {
    if (captureMode === 'auto') return;

    setCaptureMode('auto');
    setAutoCountdown(3);

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count--;
      setAutoCountdown(count);

      if (count <= 0) {
        clearInterval(countdownIntervalRef.current!);
        countdownIntervalRef.current = null;
        setAutoCountdown(null);
        setAutoDetectionActive(true);
      }
    }, 1000);
  }

  function handleManualModeToggle() {
    setCaptureMode('manual');
    setAutoDetectionActive(false);
    setAutoCountdown(null);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    stableFramesRef.current = 0;
  }

  function retakeImage(index: number) {
    setSlots((prev) => {
      const next = [...prev];
      if (next[index].preview) {
        URL.revokeObjectURL(next[index].preview!);
      }
      next[index] = { blob: null, preview: null };
      return next;
    });
    setCurrentIndex(index);
  }

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    try {
      const effectiveScanId = scanId || `gym-${Date.now()}`;
      const effectiveUserId = userId || effectiveScanId;

      const images: { view: ViewType; url: string }[] = [];

      for (let i = 0; i < VIEWS.length; i++) {
        const slot = slots[i];
        if (!slot.blob) continue;

        const url = await uploadMultiuseImage({
          scanId: effectiveScanId,
          index: i,
          blob: slot.blob,
          flowType: 'gym',
          userId: effectiveUserId,
        });

        images.push({
          view: VIEWS[i],
          url,
        });
      }

      const res = await fetch('/api/multiuse/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowType: 'gym',
          scanId: effectiveScanId,
          userId: effectiveUserId,
          images,
          phone,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Scan API failed: ${errText}`);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      onComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to upload or analyze images');
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Status message ----------
  let statusMsg = 'Position face in circle';
  if (captureMode === 'manual') {
    statusMsg = 'Manual mode - tap capture';
  } else if (autoCountdown !== null) {
    statusMsg = `Get ready... ${autoCountdown}`;
  } else if (isCapturing) {
    statusMsg = 'Capturing...';
  } else if (faceDetected && faceInCircle && mouthOpen) {
    statusMsg = 'Perfect! Hold still...';
  } else if (faceDetected && !faceInCircle) {
    statusMsg = 'Move face into circle';
  } else if (faceDetected && faceInCircle && !mouthOpen) {
    statusMsg = 'Open mouth slightly';
  } else if (!faceDetected) {
    statusMsg = 'Looking for face...';
  }

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-white">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div
        className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm"
        style={{ height: '72px' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 h-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#4ebff7]" />
              <h2 className="text-sm font-semibold">Dental Capture</h2>
            </div>
            <p className="text-xs text-gray-500">
              {currentIndex + 1}/5: {VIEW_LABELS[currentView]}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#4ebff7]">
              {capturedCount}/5
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="max-w-4xl mx-auto px-4 py-4"
        style={{ paddingBottom: '180px' }}
      >
        <div
          className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
          style={{ minHeight: '60px' }}
        >
          <p className="text-sm font-bold text-gray-900 mb-1">
            📸 {VIEW_LABELS[currentView]} View
          </p>
          <p className="text-xs text-gray-700">
            {VIEW_INSTRUCTIONS[currentView]}
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={handleAutoModeToggle}
            disabled={captureMode === 'auto'}
            className={`flex-1 py-2 rounded-lg font-bold ${
              captureMode === 'auto'
                ? 'bg-[#4ebff7] text-white'
                : 'border border-gray-300 bg-white'
            }`}
          >
            Auto
            {autoCountdown !== null && (
              <span className="ml-2 text-lg">{autoCountdown}</span>
            )}
          </button>

          <button
            onClick={handleManualModeToggle}
            disabled={captureMode === 'manual'}
            className={`flex-1 py-2 rounded-lg font-bold ${
              captureMode === 'manual'
                ? 'bg-[#4ebff7] text-white'
                : 'border border-gray-300 bg-white'
            }`}
          >
            Manual
          </button>
        </div>

        <div
          className={`mb-4 p-3 rounded-lg text-center font-semibold text-sm transition-colors ${
            isCapturing
              ? 'bg-green-100 text-green-900 border-2 border-green-500'
              : faceInCircle && mouthOpen
              ? 'bg-blue-100 text-blue-900 border border-blue-300'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}
          style={{
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {statusMsg}
        </div>

        <div
          className="relative mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl"
          style={{ width: '100%', maxWidth: '400px', aspectRatio: '3/4' }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {cameraReady && (
            <>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <circle
                  cx="50%"
                  cy="40%"
                  r="25%"
                  fill="none"
                  stroke={faceInCircle ? '#10b981' : '#3b82f6'}
                  strokeWidth="3"
                />
                <text
                  x="50%"
                  y="15%"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Keep face in circle
                </text>
              </svg>

              <div className="absolute top-2 left-2 right-2 flex gap-2 text-xs flex-wrap">
                <div
                  className={`px-2 py-1 rounded ${
                    faceDetected ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}
                >
                  Face: {faceDetected ? '✓' : '✗'}
                </div>
                <div
                  className={`px-2 py-1 rounded ${
                    faceInCircle ? 'bg-green-500' : 'bg-amber-500'
                  } text-white`}
                >
                  Circle: {faceInCircle ? '✓' : '✗'}
                </div>
                <div
                  className={`px-2 py-1 rounded ${
                    mouthOpen ? 'bg-green-500' : 'bg-amber-500'
                  } text-white`}
                >
                  Mouth: {mouthOpen ? '✓' : '✗'}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 mx-auto" style={{ maxWidth: '400px' }}>
          <button
            onClick={manualCapture}
            disabled={!cameraReady || isCapturing}
            className="w-full py-3 bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-bold rounded-xl disabled:bg-gray-400 transition-colors"
            style={{ height: '48px' }}
          >
            {isCapturing ? 'Capturing...' : '📸 Manual Capture'}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Captured Photos</h3>
          <div className="grid grid-cols-5 gap-2">
            {VIEWS.map((view, i) => {
              const slot = slots[i];
              const isCurrent = i === currentIndex;
              const hasCaptured = slot.blob !== null;

              return (
                <div key={view} className="relative">
                  <button
                    onClick={() => setCurrentIndex(i)}
                    className={`w-full rounded-lg border-2 p-1 ${
                      isCurrent
                        ? 'border-[#4ebff7] bg-blue-50'
                        : hasCaptured
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-white'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className="text-xs mb-1 font-medium text-center">
                      {VIEW_LABELS[view]}
                    </div>
                    <div className="aspect-[3/4] rounded overflow-hidden border border-gray-200">
                      {slot.preview ? (
                        <img
                          src={slot.preview}
                          alt={view}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Camera className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </button>

                  {hasCaptured && (
                    <>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          retakeImage(i);
                        }}
                        className="absolute bottom-1 left-1 right-1 bg-orange-600 hover:bg-orange-700 text-white text-xs py-0.5 rounded"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Retake
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4"
        style={{ height: '80px' }}
      >
        <div className="max-w-4xl mx-auto flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-3 border border-gray-300 rounded-lg font-medium"
            style={{ touchAction: 'manipulation' }}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`flex-1 py-3 rounded-lg font-bold ${
              canSubmit && !submitting
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            {submitting
              ? 'Analyzing...'
              : canSubmit
              ? '✓ Generate Report'
              : `Photos (${capturedCount}/5)`}
          </button>
        </div>
      </div>
    </div>
  );
}
