// src/hooks/useDentalCaptureGuardrail.ts
import { useCallback, useEffect, useState, useRef } from 'react';
import { FaceDetectionResult } from './useMediaPipeFaceDetection';

export type ViewType = 'front' | 'left' | 'right' | 'upper' | 'lower';

export interface GuardrailResult {
  faceAligned: boolean;
  mouthValid: boolean;
  qualityOk: boolean;
  readyToCapture: boolean;
  statusMessage: string;
  instructions: string;
  countdown: number; // 0 = no countdown, 1-3 = countdown active
  circleCenter: { x: number; y: number }; // normalized (0-1)
  circleRadius: number; // normalized (0-1)
  inCooldown: boolean; // true when in post-capture cooldown
  cooldownRemaining: number; // seconds remaining in cooldown
  startCooldown: () => void; // function to trigger cooldown
}

export interface QualityChecks {
  blur: boolean;
  brightness: boolean;
  exposure: boolean;
}

interface GuardrailOptions {
  viewType: ViewType;
  circleRadius: number; // normalized (0-1)
  circleCenter: { x: number; y: number }; // normalized (0-1)
  
  // Thresholds
  faceDistanceTolerance: number;
  mouthOpennessThresholds: Record<ViewType, number>;
  stabilityFrames: number; // frames to be stable before capture
  countdownDuration: number; // seconds for countdown
  cooldownDuration: number; // seconds to wait after capture
  
  // Quality thresholds (more lenient)
  minBlurScore: number;
  minBrightness: number;
  maxBrightness: number;
}

const DEFAULT_OPTIONS: GuardrailOptions = {
  viewType: 'front',
  circleRadius: 0.4, // Larger circle for easier positioning
  circleCenter: { x: 0.5, y: 0.5 }, // Will be adjusted based on view type
  faceDistanceTolerance: 1.2, // More forgiving distance tolerance
  mouthOpennessThresholds: {
    front: 0.045,   // Much stricter - require clearly open mouth for front view
    left: 0.04,     // Stricter - require clearly open mouth for side views  
    right: 0.04,    // Stricter - require clearly open mouth for side views
    upper: 0.025,   // Much more lenient - easier for upper teeth view
    lower: 0.025,   // Much more lenient - easier for lower teeth view
  },
  stabilityFrames: 5, // Faster capture - less waiting time
  countdownDuration: 2, // Shorter countdown
  cooldownDuration: 3, // 3 seconds cooldown after capture
  minBlurScore: 30,  // More lenient blur threshold
  minBrightness: 20, // More lenient brightness
  maxBrightness: 240, // More lenient max brightness
};

// Get circle center position based on view type
function getCircleCenterForView(viewType: ViewType): { x: number; y: number } {
  switch (viewType) {
    case 'left':
      // User turns left, but appears right on mirrored camera, so circle goes right
      return { x: 0.55, y: 0.5 }; // Right side of screen for user's left turn
    case 'right': 
      // User turns right, but appears left on mirrored camera, so circle goes left
      return { x: 0.45, y: 0.5 }; // Left side of screen for user's right turn
    case 'upper':
      return { x: 0.5, y: 0.4 }; // Higher but achievable - guides user to tilt head back
    case 'lower':
      return { x: 0.5, y: 0.6 }; // Lower but achievable - guides user to tilt head forward
    case 'front':
    default:
      return { x: 0.5, y: 0.5 };  // Centered
  }
}

export function useDentalCaptureGuardrail(
  faceDetection: FaceDetectionResult,
  qualityChecks: QualityChecks,
  options: Partial<GuardrailOptions> = {}
) {
  // Merge options with defaults and adjust circle position for view type
  const baseOpts = { ...DEFAULT_OPTIONS, ...options };
  const opts = {
    ...baseOpts,
    circleCenter: options.circleCenter || getCircleCenterForView(baseOpts.viewType)
  };
  
  const [result, setResult] = useState<GuardrailResult>({
    faceAligned: false,
    mouthValid: false,
    qualityOk: false,
    readyToCapture: false,
    statusMessage: 'Looking for your face...',
    instructions: 'Face the camera directly and open your mouth slightly',
    countdown: 0,
    circleCenter: opts.circleCenter,
    circleRadius: opts.circleRadius,
    inCooldown: false,
    cooldownRemaining: 0,
    startCooldown: () => {}, // Placeholder, will be updated below
  });

  const stabilityCounterRef = useRef(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startCountdownRef = useRef<() => void>(() => {});
  const stopCountdownRef = useRef<() => void>(() => {});
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [inCooldown, setInCooldown] = useState(false);

  // Start countdown when conditions are met
  const startCountdown = useCallback(() => {
    if (isCountingDown) return;
    
    setIsCountingDown(true);
    let count = opts.countdownDuration;
    
    setResult(prev => ({ ...prev, countdown: count }));
    
    countdownIntervalRef.current = setInterval(() => {
      count--;
      setResult(prev => ({ ...prev, countdown: count }));
      
      if (count <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        setIsCountingDown(false);
        setResult(prev => ({ 
          ...prev, 
          countdown: 0, 
          readyToCapture: true,
          statusMessage: 'Capturing!'
        }));
      }
    }, 1000);
  }, [opts.countdownDuration]);

  // Store in ref to avoid dependency issues
  startCountdownRef.current = startCountdown;

  // Start cooldown after capture
  const startCooldown = useCallback(() => {
    console.log('🕐 Starting post-capture cooldown...');
    setInCooldown(true);
    
    // Reset stability counter and countdown state
    stabilityCounterRef.current = 0;
    setIsCountingDown(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    let remaining = opts.cooldownDuration;
    
    setResult(prev => ({
      ...prev,
      inCooldown: true,
      cooldownRemaining: remaining,
      readyToCapture: false,
      countdown: 0,
      statusMessage: `Please wait ${remaining} seconds before next capture...`
    }));
    
    cooldownIntervalRef.current = setInterval(() => {
      remaining--;
      
      if (remaining <= 0) {
        console.log('✅ Cooldown complete');
        setInCooldown(false);
        setResult(prev => ({
          ...prev,
          inCooldown: false,
          cooldownRemaining: 0,
          statusMessage: 'Looking for your face...'
        }));
        
        if (cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current);
        }
      } else {
        setResult(prev => ({
          ...prev,
          cooldownRemaining: remaining,
          statusMessage: `Please wait ${remaining} seconds before next capture...`
        }));
      }
    }, 1000);
  }, [opts.cooldownDuration]);

  // Stop countdown
  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsCountingDown(false);
    setResult(prev => ({ ...prev, countdown: 0, readyToCapture: false }));
  }, []);

  // Store in ref to avoid dependency issues
  stopCountdownRef.current = stopCountdown;

  // Main evaluation logic
  useEffect(() => {
    // Skip validation during cooldown
    if (inCooldown) {
      return;
    }
    
    const faceDetected = !!faceDetection.faceCenter && faceDetection.faceDetected && faceDetection.confidence > 0.3; // Lower confidence threshold
    const multipleFacesDetected = faceDetection.multipleFacesDetected || false;
    
    // Inline face alignment check - STRICT validation for head positioning
    const faceAligned = (() => {
      if (!faceDetection.faceCenter || multipleFacesDetected) return false;
      
      const faceCenter = faceDetection.faceCenter;
      const distance = Math.sqrt(
        Math.pow(faceCenter.x - opts.circleCenter.x, 2) +
        Math.pow(faceCenter.y - opts.circleCenter.y, 2)
      );
      
      const basicAlignment = distance <= opts.circleRadius * opts.faceDistanceTolerance;
      
      // Additional STRICT validation for left/right views
      let headPositionCorrect = true;
      
      switch (opts.viewType) {
        case 'left':
          // For left view, face should be positioned toward the right side of screen (mirrored) - RELAXED
          headPositionCorrect = faceCenter.x > 0.52;
          console.log(`Left view: face.x=${faceCenter.x.toFixed(3)}, required > 0.52`);
          break;
        case 'right':
          // For right view, face should be positioned toward the left side of screen (mirrored) - RELAXED
          headPositionCorrect = faceCenter.x < 0.48;
          console.log(`Right view: face.x=${faceCenter.x.toFixed(3)}, required < 0.48`);
          break;
        case 'upper':
          // For upper view, face should be positioned higher (head tilted back moderately) - RELAXED
          headPositionCorrect = faceCenter.y < 0.60;
          console.log(`Upper view: face.y=${faceCenter.y.toFixed(3)}, required < 0.60 (head tilted back - relaxed)`);
          break;
        case 'lower':
          // For lower view, face should be positioned slightly lower but not too extreme to keep posterior teeth visible
          headPositionCorrect = faceCenter.y > 0.45 && faceCenter.y < 0.65;
          console.log(`Lower view: face.y=${faceCenter.y.toFixed(3)}, required 0.45-0.65 (slight forward tilt to show posterior teeth)`);
          break;
        case 'front':
        default:
          // Front view - just basic circle alignment
          headPositionCorrect = true;
      }
      
      console.log(`Face alignment: distance=${distance.toFixed(3)}, basic=${basicAlignment}, position=${headPositionCorrect}`);
      
      return basicAlignment && headPositionCorrect;
    })();
    
    // Inline mouth validity check - STRICT validation for head position
    const mouthValid = (() => {
      const mouthBoundingBox = faceDetection.mouthBoundingBox;
      const mouthOpenness = faceDetection.mouthOpenness;
      
      // Require mouth detection for proper validation
      if (!mouthBoundingBox) {
        console.log('Guardrail: No mouth detected - REJECTING (strict mode)');
        return false;
      }

      const threshold = opts.mouthOpennessThresholds[opts.viewType];
      const isOpenEnough = mouthOpenness > threshold;
      
      // Add stricter validation - if mouth is barely open, reject (more lenient for upper/lower)
      const minOpenness = opts.viewType === 'upper' || opts.viewType === 'lower' ? 0.015 : 0.02;
      if (mouthOpenness < minOpenness) {
        console.log(`🗣️ Mouth CLOSED: openness=${mouthOpenness.toFixed(3)} < ${minOpenness} - REJECTING`);
        return false;
      }
      
      // STRICT position validation based on view type
      let positionValid = false;
      
      switch (opts.viewType) {
        case 'upper':
          // For upper view, mouth should be higher in frame (head tilted back moderately) - RELAXED
          positionValid = mouthBoundingBox.y < 0.60;
          console.log(`Upper view: mouth.y=${mouthBoundingBox.y.toFixed(3)}, required < 0.60 (head tilted back - relaxed)`);
          break;
        case 'lower':
          // For lower view, mouth should be positioned to show arch but not too low to lose posterior visibility
          positionValid = mouthBoundingBox.y > 0.45 && mouthBoundingBox.y < 0.70;
          console.log(`Lower view: mouth.y=${mouthBoundingBox.y.toFixed(3)}, required 0.45-0.70 (optimal angle for posterior teeth)`);
          break;
        case 'left':
          // User turns left, mouth appears on RIGHT side of mirrored camera - RELAXED
          positionValid = mouthBoundingBox.x > 0.55;
          console.log(`Left view: mouth.x=${mouthBoundingBox.x.toFixed(3)}, required > 0.55 (right side of screen)`);
          break;
        case 'right':
          // User turns right, mouth appears on LEFT side of mirrored camera - RELAXED
          positionValid = mouthBoundingBox.x < 0.45;
          console.log(`Right view: mouth.x=${mouthBoundingBox.x.toFixed(3)}, required < 0.45 (left side of screen)`);
          break;
        case 'front':
          // Front view - mouth should be centered (more lenient)
          positionValid = mouthBoundingBox.x > 0.3 && mouthBoundingBox.x < 0.7;
          console.log(`Front view: mouth.x=${mouthBoundingBox.x.toFixed(3)}, required 0.3-0.7`);
          break;
        default:
          positionValid = true;
      }
      
      console.log(`🗣️ Mouth validation for ${opts.viewType}: openness=${mouthOpenness.toFixed(3)} (need >${threshold}), position=${positionValid}, bbox.y=${mouthBoundingBox.y.toFixed(3)}, bbox.x=${mouthBoundingBox.x.toFixed(3)}`);
      
      return isOpenEnough && positionValid;
    })();
    
    const qualityOk = qualityChecks.blur && qualityChecks.brightness && qualityChecks.exposure;

    console.log(`🔍 Guardrail Debug:`);
    console.log(`  Face detected: ${faceDetected} (confidence: ${faceDetection.confidence?.toFixed(3) || 'N/A'})`);
    console.log(`  Face aligned: ${faceAligned}`);
    console.log(`  Mouth valid: ${mouthValid} (openness: ${faceDetection.mouthOpenness?.toFixed(3) || 'N/A'})`);
    console.log(`  Quality OK: ${qualityOk} (blur: ${qualityChecks.blur}, brightness: ${qualityChecks.brightness}, exposure: ${qualityChecks.exposure})`);
    console.log(`  View type: ${opts.viewType}`);
    console.log(`  Stability counter: ${stabilityCounterRef.current}/${opts.stabilityFrames}`);
    console.log(`  Is counting down: ${isCountingDown}`);

    // STRICT VALIDATION: All conditions must be met - NO TEST MODE FALLBACK
    const allConditionsMet = faceDetected && faceAligned && mouthValid && qualityOk;
    
    console.log(`  ALL CONDITIONS MET: ${allConditionsMet} (strict validation only)`);
    
    if (allConditionsMet) {
      stabilityCounterRef.current++;
      console.log(`  ✅ Incrementing stability counter: ${stabilityCounterRef.current}`);
      
      // Only start countdown if not already counting down AND not ready to capture
      if (stabilityCounterRef.current >= opts.stabilityFrames && !isCountingDown && !result.readyToCapture) {
        console.log(`  🚀 Starting countdown for ${opts.viewType} view!`);
        startCountdownRef.current?.();
      }
    } else {
      if (stabilityCounterRef.current > 0) {
        console.log(`  ❌ Resetting stability counter (was ${stabilityCounterRef.current})`);
      }
      stabilityCounterRef.current = 0;
      if (isCountingDown) {
        stopCountdownRef.current?.();
      }
      // Reset readyToCapture if conditions are no longer met
      if (result.readyToCapture) {
        setResult(prev => ({ ...prev, readyToCapture: false }));
      }
    }

    // Inline status message generation
    const statusMessage = (() => {
      if (!faceDetected) {
        return 'Looking for your face...';
      }
      
      if (multipleFacesDetected) {
        return 'Make sure only one person is in the frame';
      }
      
      if (!faceAligned) {
        switch (opts.viewType) {
          case 'left':
            return 'Turn your head LEFT and move to the right circle on screen';
          case 'right':
            return 'Turn your head RIGHT and move to the left circle on screen';
          case 'upper':
            return 'Get closer to the circle and tilt back a bit';
          case 'lower':
            return 'Get closer to the circle and tilt forward a bit';
          case 'front':
          default:
            return 'Move your face closer to the circle';
        }
      }
      
      if (!mouthValid) {
        const currentOpenness = faceDetection.mouthOpenness || 0;
        const requiredOpenness = opts.mouthOpennessThresholds[opts.viewType];
        
        switch (opts.viewType) {
          case 'front':
            return `Open your mouth wider to show your teeth (${(currentOpenness*100).toFixed(0)}% - need ${(requiredOpenness*100).toFixed(0)}%+)`;
          case 'upper':
            return `Open wider to show your upper teeth (${(currentOpenness*100).toFixed(0)}% - need ${(requiredOpenness*100).toFixed(0)}%+)`;
          case 'lower':
            return `Open wider to show your lower teeth (${(currentOpenness*100).toFixed(0)}% - need ${(requiredOpenness*100).toFixed(0)}%+)`;
          case 'left':
            return `Open your mouth wider to show your left teeth (${(currentOpenness*100).toFixed(0)}% - need ${(requiredOpenness*100).toFixed(0)}%+)`;
          case 'right':
            return `Open your mouth wider to show your right teeth (${(currentOpenness*100).toFixed(0)}% - need ${(requiredOpenness*100).toFixed(0)}%+)`;
          default:
            return 'Open your mouth wider';
        }
      }
      
      if (!qualityOk) {
        return 'Hold still for better image quality';
      }
      
      return 'Hold still...';
    })();
    
    // Inline instructions generation
    const instructions = (() => {
      switch (opts.viewType) {
        case 'left':
          return 'Turn your head LEFT (your left) so we can see your left teeth';
        case 'right':
          return 'Turn your head RIGHT (your right) so we can see your right teeth';
        case 'upper':
          return 'Tilt your head BACK and open WIDE to show your upper teeth';
        case 'lower':
          return 'Tilt your head FORWARD and open WIDE to show your lower teeth';
        case 'front':
        default:
          return 'Face the camera directly and open your mouth slightly';
      }
    })();

    setResult(prev => ({
      ...prev,
      faceAligned,
      mouthValid,
      qualityOk,
      statusMessage,
      instructions,
      circleCenter: opts.circleCenter,
      circleRadius: opts.circleRadius,
    }));

  }, [
    faceDetection.faceCenter,
    faceDetection.mouthBoundingBox,
    faceDetection.mouthOpenness,
    faceDetection.faceDetected,
    faceDetection.confidence,
    qualityChecks.blur,
    qualityChecks.brightness,
    qualityChecks.exposure,
    opts.stabilityFrames,
    opts.viewType,
    opts.circleCenter.x,
    opts.circleCenter.y,
    opts.circleRadius,
    opts.faceDistanceTolerance,
    opts.mouthOpennessThresholds[opts.viewType],
    isCountingDown,
    inCooldown
  ]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Reset when view type changes
  useEffect(() => {
    stabilityCounterRef.current = 0;
    stopCountdown();
  }, [opts.viewType, stopCountdown]);

  return {
    ...result,
    startCooldown, // Expose the cooldown function
  };
}