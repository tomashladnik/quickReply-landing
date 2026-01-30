// src/lib/dental/qualityGuardrails.ts
import { QualityChecks } from '@/hooks/useDentalCaptureGuardrail';

/**
 * Enhanced quality checks for dental capture guardrails
 */

export interface QualityOptions {
  minBlurScore: number;
  minBrightness: number;
  maxBrightness: number;
  minContrast: number;
}

const DEFAULT_QUALITY_OPTIONS: QualityOptions = {
  minBlurScore: 100,
  minBrightness: 30,
  maxBrightness: 220,
  minContrast: 20,
};

/**
 * Calculate blur score using Laplacian variance
 */
export function calculateBlurScore(imageData: ImageData): number {
  const { width, height, data } = imageData;
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  // Convert to grayscale and apply Laplacian filter
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Convert to grayscale
      const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      
      // Apply Laplacian kernel
      const laplacian = Math.abs(
        gray * 4
        - data[((y - 1) * width + x) * 4] * 0.299 - data[((y - 1) * width + x) * 4 + 1] * 0.587 - data[((y - 1) * width + x) * 4 + 2] * 0.114
        - data[((y + 1) * width + x) * 4] * 0.299 - data[((y + 1) * width + x) * 4 + 1] * 0.587 - data[((y + 1) * width + x) * 4 + 2] * 0.114
        - data[(y * width + x - 1) * 4] * 0.299 - data[(y * width + x - 1) * 4 + 1] * 0.587 - data[(y * width + x - 1) * 4 + 2] * 0.114
        - data[(y * width + x + 1) * 4] * 0.299 - data[(y * width + x + 1) * 4 + 1] * 0.587 - data[(y * width + x + 1) * 4 + 2] * 0.114
      );
      
      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  if (count === 0) return 0;
  
  const mean = sum / count;
  const variance = (sumSq / count) - (mean * mean);
  
  return variance;
}

/**
 * Calculate brightness statistics
 */
export function calculateBrightnessStats(imageData: ImageData): { 
  mean: number; 
  min: number; 
  max: number; 
} {
  const { data } = imageData;
  let sum = 0;
  let min = 255;
  let max = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    const brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    
    sum += brightness;
    min = Math.min(min, brightness);
    max = Math.max(max, brightness);
    count++;
  }

  return {
    mean: count > 0 ? sum / count : 0,
    min,
    max,
  };
}

/**
 * Calculate contrast using standard deviation
 */
export function calculateContrast(imageData: ImageData): number {
  const brightnessStats = calculateBrightnessStats(imageData);
  const { data } = imageData;
  const mean = brightnessStats.mean;
  
  let sumSq = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    sumSq += Math.pow(brightness - mean, 2);
    count++;
  }

  return count > 0 ? Math.sqrt(sumSq / count) : 0;
}

/**
 * Get image data from video element
 */
export function getImageDataFromVideo(
  video: HTMLVideoElement,
  canvas?: HTMLCanvasElement
): ImageData | null {
  if (!video || video.readyState < 2) return null;

  const tempCanvas = canvas || document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return null;

  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  
  ctx.drawImage(video, 0, 0);
  
  try {
    return ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  } catch (error) {
    console.error('Failed to get image data:', error);
    return null;
  }
}

/**
 * Perform comprehensive quality checks
 */
export function performQualityChecks(
  video: HTMLVideoElement,
  options: Partial<QualityOptions> = {},
  canvas?: HTMLCanvasElement
): QualityChecks {
  const opts = { ...DEFAULT_QUALITY_OPTIONS, ...options };
  
  const imageData = getImageDataFromVideo(video, canvas);
  
  if (!imageData) {
    return {
      blur: false,
      brightness: false,
      exposure: false,
    };
  }

  // Calculate quality metrics
  const blurScore = calculateBlurScore(imageData);
  const brightnessStats = calculateBrightnessStats(imageData);
  const contrast = calculateContrast(imageData);

  // Evaluate against thresholds
  const blur = blurScore >= opts.minBlurScore;
  const brightness = brightnessStats.mean >= opts.minBrightness && 
                    brightnessStats.mean <= opts.maxBrightness;
  const exposure = contrast >= opts.minContrast;

  return {
    blur,
    brightness,
    exposure,
  };
}

/**
 * Get quality feedback messages
 */
export function getQualityFeedback(checks: QualityChecks): string[] {
  const feedback: string[] = [];
  
  if (!checks.blur) {
    feedback.push('Image too blurry – hold still or move closer');
  }
  
  if (!checks.brightness) {
    feedback.push('Lighting issue – move to better lighting');
  }
  
  if (!checks.exposure) {
    feedback.push('Low contrast – improve lighting conditions');
  }
  
  return feedback;
}
