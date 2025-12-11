// src/hooks/useMediaPipeFaceDetection.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver, FaceLandmarkerResult } from '@mediapipe/tasks-vision';

export interface FaceDetectionResult {
  faceCenter: { x: number; y: number } | null;
  mouthLandmarks: { x: number; y: number }[] | null;
  mouthBoundingBox: { x: number; y: number; width: number; height: number } | null;
  mouthOpenness: number;
  faceDetected: boolean;
  confidence: number;
  multipleFacesDetected: boolean;
  faceCount: number;
}

export interface UseMediaPipeFaceDetectionOptions {
  enabled?: boolean;
  processingInterval?: number; // ms between processing frames
}

export function useMediaPipeFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: UseMediaPipeFaceDetectionOptions = {}
) {
  const { enabled = true, processingInterval = 100 } = options;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FaceDetectionResult>({
    faceCenter: null,
    mouthLandmarks: null,
    mouthBoundingBox: null,
    mouthOpenness: 0,
    faceDetected: false,
    confidence: 0,
    multipleFacesDetected: false,
    faceCount: 0,
  });

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessTimeRef = useRef<number>(0);
  const isInitializingRef = useRef<boolean>(false);

  // Initialize MediaPipe
  const initializeMediaPipe = useCallback(async () => {
    if (!enabled || isInitializingRef.current || faceLandmarkerRef.current) {
      console.log('Skipping MediaPipe initialization - already initialized or in progress');
      return;
    }
    
    try {
      isInitializingRef.current = true;
      setIsLoading(true);
      setError(null);

      // Check if MediaPipe is supported
      if (typeof window === 'undefined') {
        throw new Error('MediaPipe requires browser environment');
      }

      console.log('Initializing MediaPipe Face Landmarker...');
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      let faceLandmarker: FaceLandmarker;
      
      try {
        // Try GPU first
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch (gpuError) {
        console.warn('GPU delegate failed, falling back to CPU:', gpuError);
        // Fallback to CPU
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      }

      faceLandmarkerRef.current = faceLandmarker;
      setIsLoading(false);
      console.log('MediaPipe Face Landmarker initialized successfully');
    } catch (err) {
      console.error('Failed to initialize MediaPipe Face Landmarker:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize face detection');
      setIsLoading(false);
    } finally {
      isInitializingRef.current = false;
    }
  }, [enabled]);

  // Process video frame
  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    const faceLandmarker = faceLandmarkerRef.current;

    // Early exit with comprehensive checks
    if (!video || !faceLandmarker || !enabled || 
        video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA ||
        video.videoWidth === 0 || video.videoHeight === 0 ||
        video.paused || video.ended || video.seeking ||
        video.currentTime <= 0) {
      return;
    }

    // Rate limiting
    const now = performance.now();
    if (now - lastProcessTimeRef.current < processingInterval) {
      return;
    }
    lastProcessTimeRef.current = now;

    try {
      // Additional validation for faceLandmarker state
      if (!faceLandmarker || 
          typeof faceLandmarker.detectForVideo !== 'function') {
        console.warn('Face landmarker not properly initialized');
        return;
      }

      // Use performance.now() for consistent timestamp - MediaPipe expects monotonic time
      const timestamp = performance.now();
      
      // Validate timestamp is positive and reasonable
      if (!timestamp || timestamp < 0 || !isFinite(timestamp)) {
        console.warn('Invalid timestamp for MediaPipe:', timestamp);
        return;
      }
      
      let results: FaceLandmarkerResult;
      try {
        results = faceLandmarker.detectForVideo(video, timestamp);
      } catch (detectionError: any) {
        // Handle specific MediaPipe errors gracefully
        const errorMsg = detectionError?.message || String(detectionError);
        
        // Skip common timing-related errors silently
        if (errorMsg.includes('timestamp') || 
            errorMsg.includes('video') ||
            errorMsg.includes('Input timestamp') ||
            errorMsg.includes('monotonically') ||
            errorMsg.includes('timestamp is') ||
            errorMsg.includes('non-monotonic')) {
          // Skip this frame for timing-related errors
          return;
        }
        
        console.warn('Face detection failed:', errorMsg);
        // Set fallback state without spamming errors
        setResult(prev => ({
          ...prev,
          faceDetected: false,
          faceCenter: null,
          mouthLandmarks: null,
          mouthBoundingBox: null,
          mouthOpenness: 0,
          confidence: 0,
        }));
        return;
      }

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const faceCount = results.faceLandmarks.length;
        const multipleFacesDetected = faceCount > 1;
        
        // Use primary face (first detected face) for processing
        const landmarks = results.faceLandmarks[0];
        
        // Calculate face center using nose and eye landmarks
        // Nose tip: landmark 1, Left eye: 33, Right eye: 263
        const noseTip = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        
        const faceCenter = {
          x: (noseTip.x + leftEye.x + rightEye.x) / 3,
          y: (noseTip.y + leftEye.y + rightEye.y) / 3,
        };

        // Extract mouth landmarks
        // Mouth landmarks: 0, 17, 18, 200, 269, 270, 271, 272, 308, 312, 318
        const mouthIndices = [0, 17, 18, 200, 269, 270, 271, 272, 308, 312, 318];
        const mouthLandmarks = mouthIndices.map(i => landmarks[i]);

        // Calculate mouth bounding box
        const mouthXs = mouthLandmarks.map(l => l.x);
        const mouthYs = mouthLandmarks.map(l => l.y);
        const minX = Math.min(...mouthXs);
        const maxX = Math.max(...mouthXs);
        const minY = Math.min(...mouthYs);
        const maxY = Math.max(...mouthYs);

        const mouthBoundingBox = {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        };

        // Calculate mouth openness (distance between upper and lower lip centers)
        const upperLipCenter = landmarks[12]; // Upper lip center
        const lowerLipCenter = landmarks[15]; // Lower lip center
        const mouthOpenness = Math.sqrt(
          Math.pow(upperLipCenter.x - lowerLipCenter.x, 2) +
          Math.pow(upperLipCenter.y - lowerLipCenter.y, 2)
        );

        setResult({
          faceCenter,
          mouthLandmarks,
          mouthBoundingBox,
          mouthOpenness,
          faceDetected: true,
          confidence: results.faceBlendshapes && results.faceBlendshapes.length > 0 
            ? results.faceBlendshapes[0].categories?.[0]?.score || 0.5
            : 0.5,
          multipleFacesDetected,
          faceCount,
        });
      } else {
        setResult(prev => ({
          ...prev,
          faceCenter: null,
          mouthLandmarks: null,
          mouthBoundingBox: null,
          mouthOpenness: 0,
          faceDetected: false,
          confidence: 0,
          multipleFacesDetected: false,
          faceCount: 0,
        }));
      }
    } catch (err) {
      console.error('Error processing frame:', err);
    }
  }, [videoRef, enabled, processingInterval]);

  // Start processing loop with delay for video to be ready
  useEffect(() => {
    if (enabled && !isLoading && !error && faceLandmarkerRef.current) {
      const video = videoRef.current;
      
      const startProcessing = () => {
        // Double-check video readiness AND MediaPipe initialization before starting processing
        if (video && 
            faceLandmarkerRef.current &&
            video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA &&
            video.videoWidth > 0 && 
            video.videoHeight > 0 &&
            !video.paused &&
            !video.ended) {
          
          if (processingIntervalRef.current) {
            clearInterval(processingIntervalRef.current);
          }
          
          processingIntervalRef.current = setInterval(() => {
            processFrame();
          }, processingInterval);
          
          console.log('MediaPipe processing started successfully');
        }
      };
      
      const handleVideoReady = () => {
        // Only start if MediaPipe is ready
        if (faceLandmarkerRef.current && !isInitializingRef.current) {
          console.log('Video ready for MediaPipe processing');
          setTimeout(startProcessing, 500); // Small additional delay for stability
        }
      };
      
      // Listen for video events to ensure it's ready
      if (video) {
        video.addEventListener('canplay', handleVideoReady);
        video.addEventListener('playing', handleVideoReady);
      }
      
      // Also try after initial delay
      const startDelay = setTimeout(startProcessing, 1000);

      return () => {
        clearTimeout(startDelay);
        if (video) {
          video.removeEventListener('canplay', handleVideoReady);
          video.removeEventListener('playing', handleVideoReady);
        }
        if (processingIntervalRef.current) {
          clearInterval(processingIntervalRef.current);
        }
      };
    }
  }, [enabled, isLoading, error, processingInterval, processFrame]);

  // Initialize on mount or when enabled changes from false to true
  useEffect(() => {
    if (enabled && !faceLandmarkerRef.current && !isInitializingRef.current) {
      initializeMediaPipe();
    }
  }, [enabled, initializeMediaPipe]);

  // Cleanup
  useEffect(() => {
    return () => {
      console.log('Cleaning up MediaPipe Face Detection...');
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
      isInitializingRef.current = false;
    };
  }, []);

  return {
    result,
    isLoading,
    error,
    processFrame,
  };
}