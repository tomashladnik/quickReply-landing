// src/components/dental/FaceAlignmentOverlay.tsx
"use client";

import React from 'react';
import { FaceDetectionResult } from '@/hooks/useMediaPipeFaceDetection';
import { GuardrailResult } from '@/hooks/useDentalCaptureGuardrail';

interface FaceAlignmentOverlayProps {
  faceDetection: FaceDetectionResult;
  guardrail: GuardrailResult;
  videoRef: React.RefObject<HTMLVideoElement>;
  circleRadius?: number; // percentage of container width
  className?: string;
}

export function FaceAlignmentOverlay({
  faceDetection,
  guardrail,
  videoRef,
  circleRadius = 30,
  className = '',
}: FaceAlignmentOverlayProps) {
  const video = videoRef.current;
  
  if (!video) return null;

  const containerWidth = video.offsetWidth || 320;
  const containerHeight = video.offsetHeight || 240;
  
  // Circle properties - use dynamic position from guardrail
  const centerX = (guardrail.circleCenter?.x || 0.5) * containerWidth;
  const centerY = (guardrail.circleCenter?.y || 0.5) * containerHeight;
  const radius = Math.min(containerWidth, containerHeight) * (circleRadius / 100);

  // Face center position (if detected)
  const faceCenterX = faceDetection.faceCenter 
    ? faceDetection.faceCenter.x * containerWidth 
    : null;
  const faceCenterY = faceDetection.faceCenter 
    ? faceDetection.faceCenter.y * containerHeight 
    : null;

  // Circle color based on alignment state
  const getCircleColor = () => {
    if (!faceDetection.faceDetected) return '#94a3b8'; // gray
    if (guardrail.faceAligned && guardrail.mouthValid && guardrail.qualityOk) return '#10b981'; // green
    if (guardrail.faceAligned) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Helper circle - larger, more visible background circle
  const HelperCircle = () => {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={radius + 20}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
        className="animate-pulse"
      />
    );
  };

  // Countdown ring
  const CountdownRing = () => {
    if (guardrail.countdown === 0) return null;

    const circumference = 2 * Math.PI * (radius + 15);
    const progress = ((3 - guardrail.countdown) / 3) * circumference;

    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={radius + 15}
        fill="none"
        stroke="#10b981"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-linear"
      />
    );
  };

  // Face dot indicator
  const FaceIndicator = () => {
    if (!faceDetection.faceDetected || !faceCenterX || !faceCenterY) return null;

    return (
      <circle
        cx={faceCenterX}
        cy={faceCenterY}
        r="6"
        fill={guardrail.faceAligned ? '#10b981' : '#ef4444'}
        stroke="white"
        strokeWidth="2"
        className="transition-colors duration-300"
      />
    );
  };

  // Mouth landmarks visualization
  const MouthLandmarks = () => {
    if (!faceDetection.mouthLandmarks || !guardrail.mouthValid) return null;

    return (
      <g>
        {faceDetection.mouthLandmarks.map((landmark, index) => (
          <circle
            key={index}
            cx={landmark.x * containerWidth}
            cy={landmark.y * containerHeight}
            r="2"
            fill="#10b981"
            opacity="0.7"
          />
        ))}
      </g>
    );
  };

  // Mouth bounding box
  const MouthBoundingBox = () => {
    if (!faceDetection.mouthBoundingBox || !guardrail.mouthValid) return null;

    const box = faceDetection.mouthBoundingBox;
    const x = box.x * containerWidth;
    const y = box.y * containerHeight;
    const width = box.width * containerWidth;
    const height = box.height * containerHeight;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.8"
      />
    );
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        width={containerWidth}
        height={containerHeight}
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Helper circle - larger guidance circle */}
        <HelperCircle />
        
        {/* Main alignment circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={getCircleColor()}
          strokeWidth="4"
          strokeDasharray="10,5"
          className="transition-colors duration-300"
          opacity="0.9"
        />
        
        {/* Countdown ring */}
        <CountdownRing />
        
        {/* Face center indicator */}
        <FaceIndicator />
        
        {/* Mouth landmarks */}
        <MouthLandmarks />
        
        {/* Mouth bounding box */}
        <MouthBoundingBox />
        
        {/* Center crosshair */}
        <g opacity="0.5">
          <line
            x1={centerX - 10}
            y1={centerY}
            x2={centerX + 10}
            y2={centerY}
            stroke={getCircleColor()}
            strokeWidth="2"
          />
          <line
            x1={centerX}
            y1={centerY - 10}
            x2={centerX}
            y2={centerY + 10}
            stroke={getCircleColor()}
            strokeWidth="2"
          />
        </g>
      </svg>
      
      {/* Countdown number */}
      {guardrail.countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-70 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {guardrail.countdown}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}